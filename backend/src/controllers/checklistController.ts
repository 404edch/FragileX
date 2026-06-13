import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";
import { calculateChecklistScore, mapSymptomsToChecklists } from "../services/checklistService";

export const salvarChecklist = async (req: Request, res: Response): Promise<any> => {
  const { idPaciente, idMedico, preenchidoPor, sintomasSelecionados } = req.body;
  const role = (req as any).user?.role;

  if (!idPaciente || !preenchidoPor || !Array.isArray(sintomasSelecionados)) {
    return res.status(400).json({ error: "idPaciente, preenchidoPor e sintomasSelecionados são obrigatórios." });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Buscar sexo biológico do paciente
    const pacRes = await client.query("SELECT p.sexo_biologico, u.nome FROM pacientes p JOIN usuarios u ON p.id_usuario = u.id WHERE u.id = $1", [idPaciente]);
    if (pacRes.rows.length === 0) {
      throw new Error("Paciente não encontrado no banco de dados.");
    }
    const sexo_biologico = pacRes.rows[0].sexo_biologico; // 'M' ou 'F'
    const pacNome = pacRes.rows[0].nome;

    const { scoreCalculado, memoriaCalculo, classificacao, sintomasEncontrados } = 
      await calculateChecklistScore(client, sintomasSelecionados, sexo_biologico);

    // Inserir na tabela checklists
    const insertChecklistQuery = `
      INSERT INTO checklists (id_paciente, id_medico, preenchido_por, score_final, classificacao, memoria_calculo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, data_preenchimento
    `;
    const checklistRes = await client.query(insertChecklistQuery, [
      idPaciente,
      idMedico || null,
      preenchidoPor,
      scoreCalculado,
      classificacao,
      memoriaCalculo
    ]);
    const checklistId = checklistRes.rows[0].id;

    // Inserir cada sintoma selecionado
    if (sintomasSelecionados.length > 0) {
      for (const idSintoma of sintomasSelecionados) {
        const insertSintomaQuery = `
          INSERT INTO checklist_sintomas (id_checklist, id_sintoma, possui)
          VALUES ($1, $2, true)
        `;
        await client.query(insertSintomaQuery, [checklistId, idSintoma]);
      }
    }

    await client.query("COMMIT");

    // Inserir notificação PCR se classificação suspeita ou preenchido por profissional
    const rolesProfissionais = ['medico', 'instituto', 'admin'];
    if (classificacao === 'Suspeito' || rolesProfissionais.includes(role)) {
      try {
        await db.query(
          `INSERT INTO notificacoes_pcr (id_checklist, id_paciente, nome_paciente, preenchido_por, score_final, classificacao)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [checklistId, idPaciente, pacNome, preenchidoPor, scoreCalculado, classificacao]
        );
      } catch (notifErr) {
        console.error("Erro ao inserir notificação PCR (não crítico):", notifErr);
      }
    }

    if (role === 'instituto') {
      try {
        await db.query(
          `UPDATE pacientes SET classificacao_oficial = $1 WHERE id_usuario = $2`,
          [classificacao, idPaciente]
        );
      } catch (err) {
        console.error("Erro ao atualizar classificacao_oficial do paciente:", err);
      }
    }

    await logAction(
      idPaciente,
      pacNome,
      "Preenchimento de Checklist",
      `Checklist concluído pelo usuário: ${preenchidoPor}.`
    );

    // Retorno customizado por segurança (paciente não vê score)
    const responsePayload: any = {
      id: checklistId,
      data_preenchimento: checklistRes.rows[0].data_preenchimento,
      sintomas_identificados: sintomasEncontrados.map(s => s.sintoma)
    };

    if (role !== 'paciente') {
      responsePayload.score_final = scoreCalculado;
      responsePayload.memoria_calculo = memoriaCalculo;
      responsePayload.classificacao = classificacao;
    }

    return res.status(201).json(responsePayload);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar checklist:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  } finally {
    client.release();
  }
};

export const obterChecklistsPaciente = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.idPaciente);
  if (isNaN(idPaciente)) {
    return res.status(400).json({ error: "ID de paciente inválido." });
  }

  const role = (req as any).user?.role;

  try {
    const query = `
      SELECT id, id_paciente, id_medico, preenchido_por, score_final, classificacao, data_preenchimento
      FROM checklists
      WHERE id_paciente = $1
      ORDER BY data_preenchimento DESC
    `;
    const checklistsRes = await db.query(query, [idPaciente]);
    const checklists = checklistsRes.rows;

    if (checklists.length === 0) {
      return res.json([]);
    }

    const symptomsQuery = `
      SELECT cs.id_checklist, cs.id_sintoma, s.sintoma AS nome_sintoma
      FROM checklist_sintomas cs
      JOIN checklists c ON cs.id_checklist = c.id
      JOIN sintomas s ON cs.id_sintoma = s.id
      WHERE c.id_paciente = $1
    `;
    const symptomsRes = await db.query(symptomsQuery, [idPaciente]);
    
    const { symptomsMap, symptomsNamesMap } = mapSymptomsToChecklists(symptomsRes.rows);

    const mapped = checklists.map(c => {
      const entry: any = {
        id: c.id,
        id_paciente: c.id_paciente,
        id_medico: c.id_medico,
        preenchido_por: c.preenchido_por,
        sintomas_selecionados: symptomsMap[c.id] || [],
        sintomas_nomes: symptomsNamesMap[c.id] || [],
        data_preenchimento: c.data_preenchimento ? new Date(c.data_preenchimento).toISOString() : new Date().toISOString()
      };

      if (role !== 'paciente') {
        entry.score_final = Number(c.score_final);
        entry.classificacao = c.classificacao;
      }

      return entry;
    });

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter checklists do paciente:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const buscarChecklistsAvancado = async (req: Request, res: Response): Promise<any> => {
  const search = req.query.search as string;
  if (!search) {
    return res.status(400).json({ error: "Parâmetro de busca não fornecido." });
  }

  const role = (req as any).user?.role;
  const isPaciente = role === 'paciente';

  try {
    const query = `
      SELECT 
        c.id, c.id_paciente, c.preenchido_por, c.score_final, c.classificacao, c.data_preenchimento,
        u.nome as paciente_nome, u.cpf as paciente_cpf
      FROM checklists c
      JOIN pacientes p ON c.id_paciente = p.id_usuario
      JOIN usuarios u ON p.id_usuario = u.id
      WHERE u.nome ILIKE $1 OR u.cpf ILIKE $1
      ORDER BY c.data_preenchimento DESC
      LIMIT 50
    `;
    const searchParam = `%${search}%`;
    const checklistsRes = await db.query(query, [searchParam]);
    const checklists = checklistsRes.rows;

    if (checklists.length === 0) {
      return res.json([]);
    }

    const checklistIds = checklists.map(c => c.id);

    const symptomsQuery = `
      SELECT cs.id_checklist, cs.id_sintoma, s.sintoma AS nome_sintoma
      FROM checklist_sintomas cs
      JOIN sintomas s ON cs.id_sintoma = s.id
      WHERE cs.id_checklist = ANY($1::int[])
    `;
    const symptomsRes = await db.query(symptomsQuery, [checklistIds]);
    
    const { symptomsMap, symptomsNamesMap } = mapSymptomsToChecklists(symptomsRes.rows);

    const mapped = checklists.map(c => {
      const entry: any = {
        id: c.id,
        id_paciente: c.id_paciente,
        paciente_nome: c.paciente_nome,
        paciente_cpf: c.paciente_cpf,
        preenchido_por: c.preenchido_por,
        sintomas_selecionados: symptomsMap[c.id] || [],
        sintomas_nomes: symptomsNamesMap[c.id] || [],
        data_preenchimento: c.data_preenchimento ? new Date(c.data_preenchimento).toISOString() : new Date().toISOString()
      };

      if (!isPaciente) {
        entry.score_final = Number(c.score_final);
        entry.classificacao = c.classificacao;
      }

      return entry;
    });

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao buscar checklists avançado:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const atualizarChecklist = async (req: Request, res: Response): Promise<any> => {
  const idChecklist = Number(req.params.id);
  const { sintomasSelecionados } = req.body;
  const user = (req as any).user;
  const role = user?.role;

  if (isNaN(idChecklist) || !Array.isArray(sintomasSelecionados)) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const chQuery = "SELECT id_paciente FROM checklists WHERE id = $1";
    const chRes = await client.query(chQuery, [idChecklist]);
    if (chRes.rows.length === 0) {
      throw new Error("Checklist não encontrado.");
    }
    const idPaciente = chRes.rows[0].id_paciente;

    if (role === 'paciente' && idPaciente !== user.userId) {
       throw new Error("Acesso negado.");
    }
    if (role === 'medico') {
       throw new Error("Médicos não têm permissão para editar checklists.");
    }

    const pacRes = await client.query("SELECT p.sexo_biologico, u.nome FROM usuarios u LEFT JOIN pacientes p ON p.id_usuario = u.id WHERE u.id = $1", [idPaciente]);
    const sexo_biologico = pacRes.rows[0]?.sexo_biologico || 'M';
    const pacNome = pacRes.rows[0]?.nome || 'Usuário Desconhecido';

    const { scoreCalculado, memoriaCalculo, classificacao } = 
      await calculateChecklistScore(client, sintomasSelecionados, sexo_biologico);

    await client.query(
      `UPDATE checklists SET score_final = $1, classificacao = $2, memoria_calculo = $3 WHERE id = $4`,
      [scoreCalculado, classificacao, memoriaCalculo, idChecklist]
    );

    await client.query(`DELETE FROM checklist_sintomas WHERE id_checklist = $1`, [idChecklist]);
    if (sintomasSelecionados.length > 0) {
      for (const idSintoma of sintomasSelecionados) {
        await client.query(
          `INSERT INTO checklist_sintomas (id_checklist, id_sintoma, possui) VALUES ($1, $2, true)`,
          [idChecklist, idSintoma]
        );
      }
    }

    await client.query("COMMIT");

    if (role === 'instituto') {
      try {
        await db.query(`UPDATE pacientes SET classificacao_oficial = $1 WHERE id_usuario = $2`, [classificacao, idPaciente]);
      } catch (err) {
        console.error("Erro ao atualizar classificacao_oficial do paciente durante atualização de checklist:", err);
      }
    }

    await logAction(user.userId, user.nome || "Usuário", "Edição de Checklist", `Editou checklist do paciente ${pacNome}.`);
    
    return res.json({ success: true });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Erro ao atualizar checklist:", error);
    return res.status(error.message === "Acesso negado." || error.message.includes("permissão") ? 403 : 500).json({ error: error.message });
  } finally {
    client.release();
  }
};

export const deletarChecklist = async (req: Request, res: Response): Promise<any> => {
  const idChecklist = Number(req.params.id);
  const user = (req as any).user;
  const role = user?.role;

  if (isNaN(idChecklist)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const chQuery = "SELECT id_paciente FROM checklists WHERE id = $1";
    const chRes = await db.query(chQuery, [idChecklist]);
    if (chRes.rows.length === 0) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }
    const idPaciente = chRes.rows[0].id_paciente;

    if (role === 'paciente' && idPaciente !== user.userId) {
       return res.status(403).json({ error: "Acesso negado." });
    }
    if (role === 'medico') {
       return res.status(403).json({ error: "Médicos não têm permissão para excluir checklists." });
    }

    await db.query("DELETE FROM checklists WHERE id = $1", [idChecklist]);
    await logAction(user.userId, user.nome || "Usuário", "Exclusão de Checklist", `Excluiu um checklist do paciente ID ${idPaciente}.`);

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar checklist:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const obterChecklistPorId = async (req: Request, res: Response): Promise<any> => {
  const idChecklist = Number(req.params.id);
  const role = (req as any).user?.role;
  const isPaciente = role === 'paciente';

  if (isNaN(idChecklist)) {
    return res.status(400).json({ error: "ID de checklist inválido." });
  }

  try {
    const query = `
      SELECT id, id_paciente, id_medico, preenchido_por, score_final, classificacao, data_preenchimento, memoria_calculo
      FROM checklists
      WHERE id = $1
    `;
    const checklistRes = await db.query(query, [idChecklist]);

    if (checklistRes.rows.length === 0) {
      return res.status(404).json({ error: "Checklist não encontrado." });
    }

    const checklist = checklistRes.rows[0];

    const symptomsQuery = `
      SELECT cs.id_sintoma, s.sintoma AS nome_sintoma
      FROM checklist_sintomas cs
      JOIN sintomas s ON cs.id_sintoma = s.id
      WHERE cs.id_checklist = $1
    `;
    const symptomsRes = await db.query(symptomsQuery, [idChecklist]);

    const result: any = {
      id: checklist.id,
      id_paciente: checklist.id_paciente,
      id_medico: checklist.id_medico,
      preenchido_por: checklist.preenchido_por,
      data_preenchimento: checklist.data_preenchimento,
      sintomas_selecionados: symptomsRes.rows.map(r => r.id_sintoma),
      sintomas_nomes: symptomsRes.rows.map(r => r.nome_sintoma)
    };

    if (!isPaciente) {
      result.score_final = Number(checklist.score_final);
      result.classificacao = checklist.classificacao;
      result.memoria_calculo = checklist.memoria_calculo;
    }

    return res.json(result);
  } catch (error) {
    console.error("Erro ao obter checklist por ID:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
