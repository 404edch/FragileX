import { db } from "../config/database";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { USER_ROLES, USER_STATUS, BCRYPT_SALT_ROUNDS, ERROR_MESSAGES } from "../utils/constants";
import { logAction } from "./auditService";

export interface CreatePatientData {
  nomePaciente: string;
  cpfPaciente: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  sexo_biologico: string;
  genero: string;
  nomeMae: string;
  nomePai?: string;
  nomeResponsavel: string;
  grauParentesco: string;
  cpfResponsavel: string;
  cidade: string;
  estado: string;
  pais: string;
  telefone2?: string;
  whatsapp?: string;
  foto_perfil?: string;
}

export const mapPatientRowToDto = (row: any) => {
  return {
    data_nascimento: row.data_nascimento ? new Date(row.data_nascimento).toISOString().split("T")[0] : "",
    sexo_biologico: row.sexo_biologico,
    genero: row.genero,
    sindrome: row.sindrome,
    responsavel_nome: row.responsavel_nome,
    cidade: row.cidade,
    estado: row.estado,
    pais: row.pais,
    whatsapp: row.whatsapp,
    id_medico_responsavel: row.id_medico_responsavel,
    foto_perfil: row.foto_perfil,
    encaminhamento_status: row.encaminhamento_status,
    classificacao_oficial: row.classificacao_oficial,
  };
};

export const mapFullPatientProfileToDto = (row: any) => {
  return {
    id_usuario: row.id_usuario,
    data_nascimento: row.data_nascimento ? new Date(row.data_nascimento).toISOString().split("T")[0] : "",
    sexo_biologico: row.sexo_biologico,
    genero: row.genero,
    sindrome: row.sindrome,
    nome_mae: row.nome_mae,
    nome_pai: row.nome_pai,
    responsavel_nome: row.responsavel_nome,
    responsavel_parentesco: row.responsavel_parentesco,
    responsavel_cpf: row.responsavel_cpf,
    cidade: row.cidade,
    estado: row.estado,
    pais: row.pais,
    telefone_2: row.telefone_2,
    whatsapp: row.whatsapp,
    id_medico_responsavel: row.id_medico_responsavel,
    foto_perfil: row.foto_perfil,
    encaminhamento_status: row.encaminhamento_status,
    classificacao_oficial: row.classificacao_oficial,
  };
};

export const createPatientByDoctor = async (data: CreatePatientData, idMedico: number) => {
  // Validate CPF and E-mail
  const checkQuery = "SELECT id, email, cpf FROM usuarios WHERE cpf = $1 OR email = $2";
  const checkRes = await db.query(checkQuery, [data.cpfPaciente, data.email]);

  if (checkRes.rows.length > 0) {
    const existing = checkRes.rows[0];
    if (existing.cpf === data.cpfPaciente) {
      throw new Error(ERROR_MESSAGES.CPF_ALREADY_REGISTERED);
    }
    throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED);
  }

  const token = crypto.randomBytes(20).toString("hex");

  try {
    await db.query("BEGIN");

    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status, token_ativacao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const userRes = await db.query(insertUserQuery, [
      data.nomePaciente,
      data.cpfPaciente,
      data.email,
      data.telefone,
      "MOCK_HASH",
      USER_ROLES.PACIENTE,
      USER_STATUS.PENDING_ACTIVATION,
      token,
    ]);
    const novoUsuarioId = userRes.rows[0].id;

    const insertPacQuery = `
      INSERT INTO pacientes (
        id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai,
        responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais,
        telefone_2, whatsapp, id_medico_responsavel, foto_perfil
      ) VALUES ($1, $2, $3, $4, 'normal', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;
    const sexoBiologicoDb = data.sexo_biologico === "masculino" || data.sexo_biologico === "M" ? "M" : "F";
    const generoDb = data.genero === "masculino" || data.genero === "M" ? "Masculino" : "Feminino";

    await db.query(insertPacQuery, [
      novoUsuarioId,
      data.dataNascimento,
      sexoBiologicoDb,
      generoDb,
      data.nomeMae,
      data.nomePai || "",
      data.nomeResponsavel,
      data.grauParentesco,
      data.cpfResponsavel,
      data.cidade,
      data.estado,
      data.pais,
      data.telefone2 || "",
      data.whatsapp || "",
      idMedico,
      data.foto_perfil || null,
    ]);

    const medUser = await db.query("SELECT nome FROM usuarios WHERE id = $1", [idMedico]);
    const medNome = medUser.rows[0]?.nome || "Médico";

    await logAction(
      idMedico,
      medNome,
      "Cadastro de Paciente",
      `Médico cadastrou o paciente ${data.nomePaciente} (Aguardando Ativação).`
    );

    await db.query("COMMIT");

    return token;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

export const createPatientSelfRegistration = async (data: CreatePatientData, senhaHash: string) => {
  const checkQuery = "SELECT id, status FROM usuarios WHERE cpf = $1";
  const checkRes = await db.query(checkQuery, [data.cpfPaciente]);
  
  if (checkRes.rows.length > 0) {
    const user = checkRes.rows[0];
    if (user.status === USER_STATUS.PENDING_ACTIVATION) {
      throw new Error(ERROR_MESSAGES.REGISTERED_BY_DOCTOR);
    }
    throw new Error(ERROR_MESSAGES.CPF_EXISTS);
  }

  const emailCheck = await db.query("SELECT id FROM usuarios WHERE email = $1", [data.email]);
  if (emailCheck.rows.length > 0) {
    throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
  }

  try {
    await db.query("BEGIN");

    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const userRes = await db.query(insertUserQuery, [
      data.nomePaciente,
      data.cpfPaciente,
      data.email,
      data.telefone,
      senhaHash,
      USER_ROLES.PACIENTE,
      USER_STATUS.ACTIVE,
    ]);
    const novoUsuarioId = userRes.rows[0].id;

    const insertPacQuery = `
      INSERT INTO pacientes (
        id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai,
        responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais,
        telefone_2, whatsapp, id_medico_responsavel, foto_perfil
      ) VALUES ($1, $2, $3, $4, 'normal', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NULL, $15)
    `;
    const sexoBiologicoDb = data.sexo_biologico === "masculino" || data.sexo_biologico === "M" ? "M" : "F";
    const generoDb = data.genero === "masculino" || data.genero === "M" ? "Masculino" : "Feminino";

    await db.query(insertPacQuery, [
      novoUsuarioId,
      data.dataNascimento,
      sexoBiologicoDb,
      generoDb,
      data.nomeMae,
      data.nomePai || "",
      data.nomeResponsavel,
      data.grauParentesco,
      data.cpfResponsavel,
      data.cidade,
      data.estado,
      data.pais,
      data.telefone2 || "",
      data.whatsapp || "",
      data.foto_perfil || null,
    ]);

    await logAction(novoUsuarioId, data.nomePaciente, "Autocadastro", "Paciente se cadastrou de forma autônoma.");

    await db.query("COMMIT");

    return novoUsuarioId;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};
