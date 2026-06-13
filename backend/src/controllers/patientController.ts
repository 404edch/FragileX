import { Request, Response } from "express";
import { db } from "../config/database";
import bcrypt from "bcryptjs";
import { logAction } from "../services/auditService";
import { 
  createPatientByDoctor, 
  createPatientSelfRegistration, 
  mapPatientRowToDto, 
  mapFullPatientProfileToDto 
} from "../services/patientService";
import { USER_STATUS, ERROR_MESSAGES, BCRYPT_SALT_ROUNDS, USER_ROLES } from "../utils/constants";

export const cadastrarPeloMedico = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = await createPatientByDoctor(req.body, req.body.idMedico);
    const linkAtivacao = `/activate-account?token=${token}`;
    return res.status(201).json({ linkAtivacao, token });
  } catch (error: any) {
    console.error("Erro ao cadastrar paciente pelo médico:", error);
    if (error.message === ERROR_MESSAGES.CPF_ALREADY_REGISTERED || error.message === ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const validarTokenAtivacao = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token é obrigatório." });
  }

  try {
    const query = "SELECT id, nome, email, role, status FROM usuarios WHERE token_ativacao = $1 AND status = $2";
    const result = await db.query(query, [token, USER_STATUS.PENDING_ACTIVATION]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const ativarConta = async (req: Request, res: Response): Promise<any> => {
  const { token, senha } = req.body;
  if (!token || !senha) {
    return res.status(400).json({ error: "Token e senha são obrigatórios." });
  }

  try {
    const checkQuery = "SELECT id, nome, role FROM usuarios WHERE token_ativacao = $1";
    const checkRes = await db.query(checkQuery, [token]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: "Token inválido." });
    }
    const user = checkRes.rows[0];

    const senhaHash = await bcrypt.hash(senha, BCRYPT_SALT_ROUNDS);
    const updateQuery = `
      UPDATE usuarios 
      SET senha_hash = $1, status = $2, token_ativacao = NULL 
      WHERE id = $3
    `;
    await db.query(updateQuery, [senhaHash, USER_STATUS.ACTIVE, user.id]);

    await logAction(user.id, user.nome, "Ativação de Conta", "Conta ativada pelo link temporário.");

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao ativar conta:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const autocadastro = async (req: Request, res: Response): Promise<any> => {
  try {
    const senhaHash = await bcrypt.hash(req.body.senha, BCRYPT_SALT_ROUNDS);
    const novoUsuarioId = await createPatientSelfRegistration(req.body, senhaHash);

    return res.status(201).json({ id: novoUsuarioId, nome: req.body.nomePaciente, role: USER_ROLES.PACIENTE, status: USER_STATUS.ACTIVE });
  } catch (error: any) {
    console.error("Erro no autocadastro:", error);
    if (error.message === ERROR_MESSAGES.REGISTERED_BY_DOCTOR) {
      return res.status(409).json({ error: error.message });
    }
    if (error.message === ERROR_MESSAGES.CPF_EXISTS || error.message === ERROR_MESSAGES.EMAIL_EXISTS) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const getPaciente = async (req: Request, res: Response): Promise<any> => {
  const idUsuario = Number(req.params.id);
  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const query = `
      SELECT id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai,
             responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais,
             telefone_2, whatsapp, id_medico_responsavel, foto_perfil, encaminhamento_status, classificacao_oficial
      FROM pacientes
      WHERE id_usuario = $1
    `;
    const result = await db.query(query, [idUsuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: ERROR_MESSAGES.PATIENT_NOT_FOUND });
    }

    const details = mapFullPatientProfileToDto(result.rows[0]);

    return res.json(details);
  } catch (error) {
    console.error("Erro ao obter paciente:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const listPacientesDoMedico = async (req: Request, res: Response): Promise<any> => {
  const idMedico = Number(req.params.idMedico);
  if (isNaN(idMedico)) {
    return res.status(400).json({ error: "ID do médico inválido." });
  }

  try {
    const query = `
      SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = $2 AND (
        p.id_medico_responsavel = $1 OR 
        u.id IN (
          SELECT id_paciente FROM vinculos_medicos WHERE id_medico = $1 AND status = 'LINK_APPROVED'
        )
      )
      ORDER BY u.nome ASC
    `;
    const result = await db.query(query, [idMedico, USER_ROLES.PACIENTE]);

    const mapped = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone,
      role: row.role,
      status: row.status,
      pacienteDetails: mapPatientRowToDto(row),
    }));

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao listar pacientes do médico:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const getPacienteByCpf = async (req: Request, res: Response): Promise<any> => {
  const cpf = req.params.cpf;
  if (!cpf) {
    return res.status(400).json({ error: "CPF não fornecido." });
  }

  try {
    const query = `
      SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.cpf = $1 AND u.role = $2
    `;
    const result = await db.query(query, [cpf, USER_ROLES.PACIENTE]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: ERROR_MESSAGES.PATIENT_NOT_FOUND });
    }

    const row = result.rows[0];
    const mapped = {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone,
      role: row.role,
      status: row.status,
      pacienteDetails: mapPatientRowToDto(row),
    };

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter paciente por CPF:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const listTodosPacientes = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = `
      SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = $1
      ORDER BY u.nome ASC
    `;
    const result = await db.query(query, [USER_ROLES.PACIENTE]);

    const mapped = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone,
      role: row.role,
      status: row.status,
      pacienteDetails: mapPatientRowToDto(row),
    }));

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao listar todos os pacientes:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const checkCpf = async (req: Request, res: Response): Promise<any> => {
  const { cpf } = req.params;
  try {
    const result = await db.query("SELECT id, nome, status FROM usuarios WHERE cpf = $1 AND role = $2", [cpf, USER_ROLES.PACIENTE]);
    if (result.rows.length > 0) {
      return res.json({ exists: true, user: result.rows[0] });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<any> => {
  const idUsuario = Number(req.params.id);
  const { status } = req.body;
  if (isNaN(idUsuario) || !status) {
    return res.status(400).json({ error: "ID ou status inválido." });
  }
  try {
    await db.query("UPDATE pacientes SET encaminhamento_status = $1 WHERE id_usuario = $2", [status, idUsuario]);
    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const atualizarFotoPerfil = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.id);
  const { fotoBase64 } = req.body;
  if (isNaN(idPaciente) || !fotoBase64) return res.status(400).json({ error: "Dados inválidos" });
  
  try {
    await db.query("UPDATE pacientes SET foto_perfil = $1 WHERE id_usuario = $2", [fotoBase64, idPaciente]);
    return res.json({ success: true, foto_url: fotoBase64 });
  } catch (err) {
    console.error("Erro ao atualizar foto", err);
    return res.status(500).json({ error: "Erro interno" });
  }
};
