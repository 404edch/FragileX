import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const solicitarCredenciamento = async (req: Request, res: Response): Promise<any> => {
  const dados = req.body;
  const { nomeCompleto, crm, especialidade, cidade, estado, email, telefone, instituicao, senha } = dados;

  if (!nomeCompleto || !crm || !email || !senha) {
    return res.status(400).json({ error: "Nome completo, CRM, e-mail e senha são obrigatórios." });
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

    const senhaHash = await bcrypt.hash(senha, 12);

    const insertQuery = `
      INSERT INTO solicitacoes_credenciamento (
        nome, crm, especialidade, cidade, estado, email, telefone, instituicao, senha_hash, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING')
      RETURNING *
    `;
    const insertRes = await db.query(insertQuery, [
      nomeCompleto, crm, especialidade, cidade || '', estado, email, telefone, instituicao || '', senhaHash
    ]);

    await logAction(null, nomeCompleto, 'Solicitação de Credenciamento', `Médico CRM ${crm} enviou pedido de credenciamento.`);

    return res.status(201).json({ message: 'Solicitação enviada com sucesso. Aguarde aprovação do Instituto.' });
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

export const contarSolicitacoesPendentes = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = "SELECT COUNT(*) FROM solicitacoes_credenciamento WHERE status = 'PENDING'";
    const result = await db.query(query);
    return res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error("Erro ao contar solicitações pendentes:", error);
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

    if (solicitacao.status !== 'PENDING') {
      return res.status(400).json({ error: "Esta solicitação já foi processada." });
    }

    if (aprovar) {
      // Verificar se e-mail já existe em usuarios
      const emailCheck = await db.query('SELECT id FROM usuarios WHERE email = $1', [solicitacao.email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "E-mail já possui conta no sistema." });
      }

      // Usar senha_hash da solicitação (médico informou ao solicitar)
      if (!solicitacao.senha_hash) {
        return res.status(400).json({ error: "Solicitação sem senha definida. Não é possível aprovar." });
      }

      await db.query("UPDATE solicitacoes_credenciamento SET status = 'APPROVED' WHERE id = $1", [idSolicitacao]);

      // Criar usuário já ATIVO com a senha do credenciamento
      const insertUserQuery = `
        INSERT INTO usuarios (nome, email, telefone, senha_hash, role, status)
        VALUES ($1, $2, $3, $4, 'medico', 'ACTIVE')
        RETURNING id
      `;
      const userRes = await db.query(insertUserQuery, [
        solicitacao.nome, solicitacao.email, solicitacao.telefone, solicitacao.senha_hash
      ]);
      const novoUsuarioId = userRes.rows[0].id;

      // Criar registro na tabela medicos
      await db.query(
        `INSERT INTO medicos (id_usuario, crm, especialidade, cidade, estado, instituicao)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [novoUsuarioId, solicitacao.crm, solicitacao.especialidade,
         solicitacao.cidade, solicitacao.estado, solicitacao.instituicao]
      );

      await logAction(null, 'Instituto', 'Aprovação de Médico', `Aprovado credenciamento do médico ${solicitacao.nome} (CRM: ${solicitacao.crm}).`);

      return res.json({ message: `Médico ${solicitacao.nome} aprovado com sucesso. Conta criada e ativa.` });
    } else {
      const recusadoMotivo = motivoRecusa || 'Não atende aos critérios institucionais.';
      await db.query(
        "UPDATE solicitacoes_credenciamento SET status = 'REJECTED', motivo_recusa = $1 WHERE id = $2",
        [recusadoMotivo, idSolicitacao]
      );

      await logAction(null, 'Instituto', 'Rejeição de Médico', `Rejeitado credenciamento do médico ${solicitacao.nome}. Motivo: ${recusadoMotivo}`);

      return res.json({ message: 'Solicitação rejeitada.' });
    }
  } catch (error: any) {
    console.error("Erro ao responder credenciamento:", error);
    return res.status(500).json({ error: "Erro interno no servidor.", details: error.message });
  }
};

export const registrarMedicoDireto = async (req: Request, res: Response): Promise<any> => {
  const { nomeCompleto, crm, especialidade, cidade, estado, email, telefone, instituicao, senha, cpf, adminUser } = req.body;

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

    if (cpf) {
      const cpfCheck = await db.query("SELECT id FROM usuarios WHERE cpf = $1", [cpf]);
      if (cpfCheck.rows.length > 0) {
        return res.status(400).json({ error: "CPF já cadastrado." });
      }
    }

    const hash = await bcrypt.hash(senha, 12);
    const finalCpf = cpf || null;
    
    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, 'medico', 'ACTIVE')
      RETURNING id, nome, email, role, status
    `;
    const userRes = await db.query(insertUserQuery, [nomeCompleto, finalCpf, email, telefone, hash]);
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
  } catch (error: any) {
    console.error("Erro ao registrar médico direto:", error);
    return res.status(500).json({ error: "Erro interno no servidor.", details: error.message });
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

