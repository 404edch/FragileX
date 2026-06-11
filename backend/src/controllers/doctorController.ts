import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const solicitarCredenciamento = async (req: Request, res: Response): Promise<any> => {
  const dados = req.body;
  const { nomeCompleto, crm, especialidade, cidade, estado, email, telefone, instituicao } = dados;

  if (!nomeCompleto || !crm || !email) {
    return res.status(400).json({ error: "Nome completo, CRM e e-mail são obrigatórios." });
  }

  try {
    const crmAtivoQuery = "SELECT id_usuario FROM medicos WHERE crm = $1";
    const crmAtivoRes = await db.query(crmAtivoQuery, [crm]);
    if (crmAtivoRes.rows.length > 0) {
      return res.status(400).json({ error: "CRM já cadastrado e ativo no sistema." });
    }

    const crmPendenteQuery = "SELECT id FROM solicitacoes_credenciamento WHERE crm = $1 AND status = 'PENDING'";
    const crmPendenteRes = await db.query(crmPendenteQuery, [crm]);
    if (crmPendenteRes.rows.length > 0) {
      return res.status(400).json({ error: "Já existe uma solicitação de credenciamento pendente para este CRM." });
    }

    const insertQuery = `
      INSERT INTO solicitacoes_credenciamento (
        nome, crm, especialidade, cidade, estado, email, telefone, instituicao, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING *
    `;
    const insertRes = await db.query(insertQuery, [
      nomeCompleto, crm, especialidade, cidade || '', estado, email, telefone, instituicao || ''
    ]);

    await logAction(null, nomeCompleto, 'Solicitação de Credenciamento', `Médico CRM ${crm} enviou pedido de credenciamento.`);

    return res.status(201).json(insertRes.rows[0]);
  } catch (error) {
    console.error("Erro ao solicitar credenciamento:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listarSolicitacoesCredenciamento = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = "SELECT * FROM solicitacoes_credenciamento ORDER BY data_criacao DESC";
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar solicitações de credenciamento:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const responderSolicitacaoCredenciamento = async (req: Request, res: Response): Promise<any> => {
  const idSolicitacao = Number(req.params.id);
  const { aprovar, motivoRecusa } = req.body;

  if (isNaN(idSolicitacao) || aprovar === undefined) {
    return res.status(400).json({ error: "ID da solicitação e resposta (aprovar) são obrigatórios." });
  }

  try {
    const solQuery = "SELECT * FROM solicitacoes_credenciamento WHERE id = $1";
    const solRes = await db.query(solQuery, [idSolicitacao]);
    if (solRes.rows.length === 0) {
      return res.status(404).json({ error: "Solicitação de credenciamento não encontrada." });
    }
    const solicitacao = solRes.rows[0];

    if (aprovar) {
      const token = crypto.randomBytes(20).toString('hex');

      // Update solicitação
      await db.query("UPDATE solicitacoes_credenciamento SET status = 'APPROVED' WHERE id = $1", [idSolicitacao]);

      // Criar usuário pendente
      const insertUserQuery = `
        INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status, token_ativacao)
        VALUES ($1, '00000000000', $2, $3, 'MOCK_HASH', 'medico', 'PENDING_ACTIVATION', $4)
        RETURNING id
      `;
      const userRes = await db.query(insertUserQuery, [solicitacao.nome, solicitacao.email, solicitacao.telefone, token]);
      const novoUsuarioId = userRes.rows[0].id;

      // Criar registro na tabela medicos
      const insertMedQuery = `
        INSERT INTO medicos (id_usuario, crm, especialidade, cidade, estado, instituicao)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await db.query(insertMedQuery, [
        novoUsuarioId, solicitacao.crm, solicitacao.especialidade,
        solicitacao.cidade, solicitacao.estado, solicitacao.instituicao
      ]);

      await logAction(1, 'Instituto/Admin', 'Aprovação de Médico', `Aprovado credenciamento do médico ${solicitacao.nome} (CRM: ${solicitacao.crm}).`);

      return res.json({ linkAtivacao: `/activate-account?token=${token}` });
    } else {
      const recusadoMotivo = motivoRecusa || 'Não atende aos critérios institucionais.';
      await db.query(
        "UPDATE solicitacoes_credenciamento SET status = 'REJECTED', motivo_recusa = $1 WHERE id = $2",
        [recusadoMotivo, idSolicitacao]
      );

      await logAction(1, 'Instituto/Admin', 'Rejeição de Médico', `Rejeitado credenciamento do médico ${solicitacao.nome}. Motivo: ${recusadoMotivo}`);

      return res.json({});
    }
  } catch (error) {
    console.error("Erro ao responder credenciamento:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const registrarMedicoDireto = async (req: Request, res: Response): Promise<any> => {
  const { nomeCompleto, crm, especialidade, cidade, estado, email, telefone, instituicao, senha, adminUser } = req.body;

  if (!nomeCompleto || !crm || !email || !senha) {
    return res.status(400).json({ error: "Nome completo, CRM, e-mail e senha são obrigatórios." });
  }

  try {
    const crmQuery = "SELECT id_usuario FROM medicos WHERE crm = $1";
    const crmRes = await db.query(crmQuery, [crm]);
    if (crmRes.rows.length > 0) {
      return res.status(400).json({ error: "CRM já cadastrado." });
    }

    const emailQuery = "SELECT id FROM usuarios WHERE email = $1";
    const emailRes = await db.query(emailQuery, [email]);
    if (emailRes.rows.length > 0) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 12);
    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status)
      VALUES ($1, '00000000000', $2, $3, $4, 'medico', 'ACTIVE')
      RETURNING id, nome, email, role, status
    `;
    const userRes = await db.query(insertUserQuery, [nomeCompleto, email, telefone, hash]);
    const novoUsuario = userRes.rows[0];

    const insertMedQuery = `
      INSERT INTO medicos (id_usuario, crm, especialidade, cidade, estado, instituicao)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(insertMedQuery, [
      novoUsuario.id, crm, especialidade, cidade, estado, instituicao
    ]);

    if (adminUser) {
      await logAction(
        adminUser.id,
        adminUser.nome,
        'Registro Direto de Médico',
        `Registrou o médico ${nomeCompleto} (CRM: ${crm}) diretamente.`
      );
    }

    return res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao registrar médico direto:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const getMedico = async (req: Request, res: Response): Promise<any> => {
  const idUsuario = Number(req.params.id);
  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const query = "SELECT id_usuario, crm, especialidade, cidade, estado, instituicao FROM medicos WHERE id_usuario = $1";
    const result = await db.query(query, [idUsuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Médico não encontrado." });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter médico:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

