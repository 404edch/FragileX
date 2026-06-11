import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";

export const solicitarVinculo = async (req: Request, res: Response): Promise<any> => {
  const { idMedico, cpf } = req.body;
  if (!idMedico || !cpf) {
    return res.status(400).json({ error: "ID do médico e CPF do paciente são obrigatórios." });
  }

  try {
    // Buscar usuário paciente
    const userQuery = "SELECT id, nome FROM usuarios WHERE cpf = $1 AND role = 'paciente'";
    const userRes = await db.query(userQuery, [cpf]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado com este CPF." });
    }
    const paciente = userRes.rows[0];

    // Buscar médico
    const medQuery = "SELECT nome FROM usuarios WHERE id = $1 AND role = 'medico'";
    const medRes = await db.query(medQuery, [idMedico]);
    if (medRes.rows.length === 0) {
      return res.status(404).json({ error: "Médico não encontrado." });
    }
    const nomeMedico = medRes.rows[0].nome;

    // Verificar se já existe vínculo
    const vinculoQuery = "SELECT * FROM vinculos_medicos WHERE id_medico = $1 AND id_paciente = $2";
    const vinculoRes = await db.query(vinculoQuery, [idMedico, paciente.id]);

    if (vinculoRes.rows.length > 0) {
      const vinculo = vinculoRes.rows[0];
      if (vinculo.status === 'LINK_APPROVED') {
        return res.status(400).json({ error: "Você já está vinculado a este paciente." });
      } else if (vinculo.status === 'PENDING_LINK') {
        return res.status(400).json({ error: "Solicitação de vínculo pendente já enviada." });
      } else if (vinculo.status === 'LINK_DENIED') {
        // Atualiza para pendente novamente
        const updateQuery = `
          UPDATE vinculos_medicos 
          SET status = 'PENDING_LINK', data_solicitacao = CURRENT_TIMESTAMP 
          WHERE id = $1 
          RETURNING *
        `;
        const updated = await db.query(updateQuery, [vinculo.id]);
        await logAction(idMedico, nomeMedico, 'Re-solicitação de Vínculo', `Médico solicitou novamente vínculo com ${paciente.nome}.`);
        return res.json({
          id: updated.rows[0].id,
          id_medico: idMedico,
          nome_medico: nomeMedico,
          id_paciente: paciente.id,
          status: 'PENDING_LINK',
          data_solicitacao: updated.rows[0].data_solicitacao
        });
      }
    }

    // Criar novo vínculo
    const insertQuery = `
      INSERT INTO vinculos_medicos (id_medico, id_paciente, status)
      VALUES ($1, $2, 'PENDING_LINK')
      RETURNING *
    `;
    const insertRes = await db.query(insertQuery, [idMedico, paciente.id]);
    await logAction(idMedico, nomeMedico, 'Solicitação de Vínculo', `Médico solicitou vínculo com ${paciente.nome}.`);

    return res.status(201).json({
      id: insertRes.rows[0].id,
      id_medico: idMedico,
      nome_medico: nomeMedico,
      id_paciente: paciente.id,
      status: 'PENDING_LINK',
      data_solicitacao: insertRes.rows[0].data_solicitacao
    });
  } catch (error) {
    console.error("Erro ao solicitar vínculo:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listarSolicitacoesVinculoPaciente = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.idPaciente);
  if (isNaN(idPaciente)) {
    return res.status(400).json({ error: "ID de paciente inválido." });
  }

  try {
    const query = `
      SELECT v.id, v.id_medico, u.nome AS nome_medico, v.id_paciente, v.status, v.data_solicitacao
      FROM vinculos_medicos v
      JOIN usuarios u ON v.id_medico = u.id
      WHERE v.id_paciente = $1 AND v.status = 'PENDING_LINK'
      ORDER BY v.data_solicitacao DESC
    `;
    const result = await db.query(query, [idPaciente]);
    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar solicitações de vínculo:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const responderSolicitacaoVinculo = async (req: Request, res: Response): Promise<any> => {
  const idVinculo = Number(req.params.id);
  const { aceitar } = req.body;

  if (isNaN(idVinculo) || aceitar === undefined) {
    return res.status(400).json({ error: "ID do vínculo e a resposta (aceitar) são obrigatórios." });
  }

  try {
    const query = "SELECT * FROM vinculos_medicos WHERE id = $1";
    const result = await db.query(query, [idVinculo]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitação de vínculo não encontrada." });
    }
    const vinculo = result.rows[0];

    const novoStatus = aceitar ? 'LINK_APPROVED' : 'LINK_DENIED';
    const updateQuery = "UPDATE vinculos_medicos SET status = $1 WHERE id = $2";
    await db.query(updateQuery, [novoStatus, idVinculo]);

    if (aceitar) {
      const updatePacQuery = "UPDATE pacientes SET id_medico_responsavel = $1 WHERE id_usuario = $2";
      await db.query(updatePacQuery, [vinculo.id_medico, vinculo.id_paciente]);
    }

    const pacUserQuery = "SELECT nome FROM usuarios WHERE id = $1";
    const pacUserRes = await db.query(pacUserQuery, [vinculo.id_paciente]);
    const pacNome = pacUserRes.rows[0]?.nome || 'Paciente';

    await logAction(
      vinculo.id_paciente,
      pacNome,
      'Resposta de Vínculo',
      `Paciente ${aceitar ? 'aceitou' : 'recusou'} o vínculo solicitado pelo médico ID ${vinculo.id_medico}.`
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao responder solicitação de vínculo:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
