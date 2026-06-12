import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";

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

    // Calcular score
    let scoreCalculado = 0;
    let memoriaCalculo = '';
    let classificacao = 'Negativo';
    let sintomasEncontrados: any[] = [];

    if (sintomasSelecionados.length > 0) {
      const sintomasRes = await client.query(`SELECT id, sintoma, score_m, score_f FROM sintomas WHERE id = ANY($1::int[])`, [sintomasSelecionados]);
      sintomasEncontrados = sintomasRes.rows;
      
      const calculos: string[] = [];
      for (const s of sintomasEncontrados) {
        const peso = sexo_biologico === 'M' ? Number(s.score_m) : Number(s.score_f);
        scoreCalculado += peso;
        calculos.push(`${s.sintoma}: ${peso.toFixed(2)}`);
      }
      memoriaCalculo = calculos.join('\n');
    }

    if (sexo_biologico === 'M' && scoreCalculado >= 0.56) classificacao = 'Suspeito';
    if (sexo_biologico === 'F' && scoreCalculado >= 0.55) classificacao = 'Suspeito';

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
    for (const idSintoma of sintomasSelecionados) {
      const insertSintomaQuery = `
        INSERT INTO checklist_sintomas (id_checklist, id_sintoma, possui)
        VALUES ($1, $2, true)
      `;
      await client.query(insertSintomaQuery, [checklistId, idSintoma]);
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
    // Buscar todos os checklists do paciente (incluindo classificacao)
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

    // Buscar os sintomas de todos os checklists do paciente, incluindo nomes
    const symptomsQuery = `
      SELECT cs.id_checklist, cs.id_sintoma, s.sintoma AS nome_sintoma
      FROM checklist_sintomas cs
      JOIN checklists c ON cs.id_checklist = c.id
      JOIN sintomas s ON cs.id_sintoma = s.id
      WHERE c.id_paciente = $1
    `;
    const symptomsRes = await db.query(symptomsQuery, [idPaciente]);
    const symptoms = symptomsRes.rows;

    // Agrupar sintomas por checklist id
    const symptomsMap: Record<number, number[]> = {};
    const symptomsNamesMap: Record<number, string[]> = {};
    symptoms.forEach(row => {
      if (!symptomsMap[row.id_checklist]) {
        symptomsMap[row.id_checklist] = [];
        symptomsNamesMap[row.id_checklist] = [];
      }
      symptomsMap[row.id_checklist].push(row.id_sintoma);
      symptomsNamesMap[row.id_checklist].push(row.nome_sintoma);
    });

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

      // Paciente não vê score e classificação
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
