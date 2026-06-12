import { Request, Response } from "express";
import { db } from "../config/database";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logAction } from "../services/auditService";

export const cadastrarPeloMedico = async (req: Request, res: Response): Promise<any> => {
  const {
    idMedico,
    nomePaciente,
    cpfPaciente,
    email,
    telefone,
    dataNascimento,
    sexo_biologico,
    genero,
    nomeMae,
    nomePai,
    nomeResponsavel,
    grauParentesco,
    cpfResponsavel,
    cidade,
    estado,
    pais,
    telefone2,
    whatsapp,
    foto_perfil,
  } = req.body;

  try {
    // Validar CPF e E-mail existentes
    const checkQuery = "SELECT id, email, cpf FROM usuarios WHERE cpf = $1 OR email = $2";
    const checkRes = await db.query(checkQuery, [cpfPaciente, email]);

    if (checkRes.rows.length > 0) {
      const existing = checkRes.rows[0];
      if (existing.cpf === cpfPaciente) {
        return res.status(400).json({ error: "CPF já cadastrado." });
      }
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const token = crypto.randomBytes(20).toString("hex");

    // Inserir na tabela usuarios
    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status, token_ativacao)
      VALUES ($1, $2, $3, $4, $5, 'paciente', 'PENDING_ACTIVATION', $6)
      RETURNING id
    `;
    const userRes = await db.query(insertUserQuery, [nomePaciente, cpfPaciente, email, telefone, "MOCK_HASH", token]);
    const novoUsuarioId = userRes.rows[0].id;

    // Inserir na tabela pacientes
    const insertPacQuery = `
      INSERT INTO pacientes (
        id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai,
        responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais,
        telefone_2, whatsapp, id_medico_responsavel, foto_perfil
      ) VALUES ($1, $2, $3, $4, 'normal', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;
    const sexoBiologicoDb = sexo_biologico === "masculino" || sexo_biologico === "M" ? "M" : "F";
    const generoDb = genero === "masculino" || genero === "M" ? "Masculino" : "Feminino";

    await db.query(insertPacQuery, [
      novoUsuarioId,
      dataNascimento,
      sexoBiologicoDb,
      generoDb,
      nomeMae,
      nomePai || "",
      nomeResponsavel,
      grauParentesco,
      cpfResponsavel,
      cidade,
      estado,
      pais,
      telefone2 || "",
      whatsapp || "",
      idMedico,
      foto_perfil || null,
    ]);

    const medUser = await db.query("SELECT nome, role FROM usuarios WHERE id = $1", [idMedico]);
    const medNome = medUser.rows[0]?.nome || "Médico";
    const medRole = medUser.rows[0]?.role || "medico";

    await logAction(idMedico, medNome, "Cadastro de Paciente", `Médico cadastrou o paciente ${nomePaciente} (Aguardando Ativação).`);

    const linkAtivacao = `/activate-account?token=${token}`;
    return res.status(201).json({ linkAtivacao, token });
  } catch (error) {
    console.error("Erro ao cadastrar paciente pelo médico:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const validarTokenAtivacao = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token é obrigatório." });
  }

  try {
    const query = "SELECT id, nome, email, role, status FROM usuarios WHERE token_ativacao = $1 AND status = $2";
    const result = await db.query(query, [token, "PENDING_ACTIVATION"]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Token de ativação inválido ou expirado." });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
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

    const senhaHash = await bcrypt.hash(senha, 12);
    const updateQuery = `
      UPDATE usuarios 
      SET senha_hash = $1, status = 'ACTIVE', token_ativacao = NULL 
      WHERE id = $2
    `;
    await db.query(updateQuery, [senhaHash, user.id]);

    await logAction(user.id, user.nome, "Ativação de Conta", "Conta ativada pelo link temporário.");

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao ativar conta:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const autocadastro = async (req: Request, res: Response): Promise<any> => {
  const {
    nomePaciente,
    cpfPaciente,
    email,
    telefone,
    dataNascimento,
    sexo_biologico,
    genero,
    nomeMae,
    nomePai,
    nomeResponsavel,
    grauParentesco,
    cpfResponsavel,
    cidade,
    estado,
    pais,
    telefone2,
    whatsapp,
    senha,
    foto_perfil,
  } = req.body;

  try {
    const checkQuery = "SELECT id, status FROM usuarios WHERE cpf = $1";
    const checkRes = await db.query(checkQuery, [cpfPaciente]);
    if (checkRes.rows.length > 0) {
      const user = checkRes.rows[0];
      if (user.status === "PENDING_ACTIVATION") {
        return res.status(409).json({ error: "REGISTRADO_PELO_MEDICO" });
      }
      return res.status(400).json({ error: "CPF_EXISTENTE" });
    }

    const emailCheck = await db.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "EMAIL_EXISTENTE" });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    // Inserir usuarios
    const insertUserQuery = `
      INSERT INTO usuarios (nome, cpf, email, telefone, senha_hash, role, status)
      VALUES ($1, $2, $3, $4, $5, 'paciente', 'ACTIVE')
      RETURNING id
    `;
    const userRes = await db.query(insertUserQuery, [nomePaciente, cpfPaciente, email, telefone, senhaHash]);
    const novoUsuarioId = userRes.rows[0].id;

    // Inserir pacientes
    const insertPacQuery = `
      INSERT INTO pacientes (
        id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai,
        responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais,
        telefone_2, whatsapp, id_medico_responsavel, foto_perfil
      ) VALUES ($1, $2, $3, $4, 'normal', $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NULL, $15)
    `;
    const sexoBiologicoDb = sexo_biologico === "masculino" || sexo_biologico === "M" ? "M" : "F";
    const generoDb = genero === "masculino" || genero === "M" ? "Masculino" : "Feminino";

    await db.query(insertPacQuery, [
      novoUsuarioId,
      dataNascimento,
      sexoBiologicoDb,
      generoDb,
      nomeMae,
      nomePai || "",
      nomeResponsavel,
      grauParentesco,
      cpfResponsavel,
      cidade,
      estado,
      pais,
      telefone2 || "",
      whatsapp || "",
      foto_perfil || null,
    ]);

    await logAction(novoUsuarioId, nomePaciente, "Autocadastro", "Paciente se cadastrou de forma autônoma.");

    return res.status(201).json({ id: novoUsuarioId, nome: nomePaciente, role: "paciente", status: "ACTIVE" });
  } catch (error) {
    console.error("Erro no autocadastro:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
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
      return res.status(404).json({ error: "Perfil do paciente não encontrado." });
    }

    const row = result.rows[0];
    const details = {
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

    return res.json(details);
  } catch (error) {
    console.error("Erro ao obter paciente:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
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
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente' AND (
        p.id_medico_responsavel = $1 OR 
        u.id IN (
          SELECT id_paciente FROM vinculos_medicos WHERE id_medico = $1 AND status = 'LINK_APPROVED'
        )
      )
      ORDER BY u.nome ASC
    `;
    const result = await db.query(query, [idMedico]);

    const mapped = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone,
      role: row.role,
      status: row.status,
      pacienteDetails: {
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
        encaminhamento_status: row.encaminhamento_status,
        classificacao_oficial: row.classificacao_oficial,
      },
    }));

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao listar pacientes do médico:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
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
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.cpf = $1 AND u.role = 'paciente'
    `;
    const result = await db.query(query, [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paciente não encontrado." });
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
      pacienteDetails: {
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
        encaminhamento_status: row.encaminhamento_status,
        classificacao_oficial: row.classificacao_oficial,
      },
    };

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter paciente por CPF:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listTodosPacientes = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = `
      SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente'
      ORDER BY u.nome ASC
    `;
    const result = await db.query(query);

    const mapped = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      telefone: row.telefone,
      role: row.role,
      status: row.status,
      pacienteDetails: {
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
      },
    }));

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao listar todos os pacientes:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const checkCpf = async (req: Request, res: Response): Promise<any> => {
  const { cpf } = req.params;
  try {
    const result = await db.query("SELECT id, nome, status FROM usuarios WHERE cpf = $1 AND role = $2", [cpf, "paciente"]);
    if (result.rows.length > 0) {
      return res.json({ exists: true, user: result.rows[0] });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error("Erro ao verificar CPF:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
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
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
