import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";

export const salvarChecklist = async (req: Request, res: Response): Promise<any> => {
  const { idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal } = req.body;

  if (!idPaciente || !preenchidoPor || !Array.isArray(sintomasSelecionados)) {
    return res.status(400).json({ error: "idPaciente, preenchidoPor e sintomasSelecionados são obrigatórios." });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Inserir na tabela checklists
    const insertChecklistQuery = `
      INSERT INTO checklists (id_paciente, id_medico, preenchido_por, score_final)
      VALUES ($1, $2, $3, $4)
      RETURNING id, id_paciente, id_medico, preenchido_por, score_final, data_preenchimento
    `;
    const checklistRes = await client.query(insertChecklistQuery, [
      idPaciente,
      idMedico || null,
      preenchidoPor,
      scoreFinal || 0
    ]);
    const checklistId = checklistRes.rows[0].id;

    // Inserir cada sintoma selecionado na tabela checklist_sintomas
    for (const idSintoma of sintomasSelecionados) {
      const insertSintomaQuery = `
        INSERT INTO checklist_sintomas (id_checklist, id_sintoma, possui)
        VALUES ($1, $2, true)
      `;
      await client.query(insertSintomaQuery, [checklistId, idSintoma]);
    }

    await client.query("COMMIT");

    // Buscar nome do paciente para log
    const userRes = await db.query("SELECT nome FROM usuarios WHERE id = $1", [idPaciente]);
    const pacNome = userRes.rows[0]?.nome || "Paciente";

    await logAction(
      idPaciente,
      pacNome,
      "Preenchimento de Checklist",
      `Checklist formal concluído. Score Final: ${Number(scoreFinal).toFixed(1)} pts (${sintomasSelecionados.length} sintomas).`
    );

    return res.status(201).json({
      id: checklistId,
      id_paciente: idPaciente,
      id_medico: idMedico,
      preenchido_por: preenchidoPor,
      score_final: scoreFinal,
      sintomas_selecionados: sintomasSelecionados,
      data_preenchimento: checklistRes.rows[0].data_preenchimento
    });
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

  try {
    // Buscar todos os checklists do paciente
    const query = `
      SELECT id, id_paciente, id_medico, preenchido_por, score_final, data_preenchimento
      FROM checklists
      WHERE id_paciente = $1
      ORDER BY data_preenchimento DESC
    `;
    const checklistsRes = await db.query(query, [idPaciente]);
    const checklists = checklistsRes.rows;

    if (checklists.length === 0) {
      return res.json([]);
    }

    // Buscar os sintomas de todos os checklists do paciente
    const symptomsQuery = `
      SELECT id_checklist, id_sintoma
      FROM checklist_sintomas cs
      JOIN checklists c ON cs.id_checklist = c.id
      WHERE c.id_paciente = $1
    `;
    const symptomsRes = await db.query(symptomsQuery, [idPaciente]);
    const symptoms = symptomsRes.rows;

    // Agrupar sintomas por checklist id
    const symptomsMap: Record<number, number[]> = {};
    symptoms.forEach(row => {
      if (!symptomsMap[row.id_checklist]) {
        symptomsMap[row.id_checklist] = [];
      }
      symptomsMap[row.id_checklist].push(row.id_sintoma);
    });

    const mapped = checklists.map(c => ({
      id: c.id,
      id_paciente: c.id_paciente,
      id_medico: c.id_medico,
      preenchido_por: c.preenchido_por,
      score_final: Number(c.score_final),
      sintomas_selecionados: symptomsMap[c.id] || [],
      data_preenchimento: c.data_preenchimento ? new Date(c.data_preenchimento).toISOString() : new Date().toISOString()
    }));

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter checklists do paciente:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
