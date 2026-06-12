import { Request, Response } from "express";
import { db } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logAction } from "../services/auditService";

const SECRET_KEY = process.env.JWT_SECRET || 'chave-super-secreta-ibk';

export const login = async (req: Request, res: Response): Promise<any> => {
  const { emailOrCpf, senha } = req.body;
  if (!emailOrCpf || !senha) {
    return res.status(400).json({ error: "Email/CPF e senha são obrigatórios." });
  }

  try {
    const query = 'SELECT * FROM usuarios WHERE email = $1 OR cpf = $2';
    const result = await db.query(query, [emailOrCpf, emailOrCpf]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas. Verifique seu e-mail/CPF e senha." });
    }

    const user = result.rows[0];

    if (user.status === 'PENDING_ACTIVATION') {
      return res.status(403).json({ error: "Esta conta ainda não foi ativada. Por favor, utilize o link de ativação enviado." });
    }

    // Médicos só podem logar se a conta estiver ACTIVE (aprovados pelo instituto)
    if (user.role === 'medico' && user.status !== 'ACTIVE') {
      return res.status(403).json({ error: "Sua solicitação de credenciamento ainda não foi aprovada pelo Instituto." });
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas. Verifique seu e-mail/CPF e senha." });
    }

    // Emitir JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    await logAction(user.id, user.nome, 'Login', 'Efetuou login por credenciais.');

    return res.status(200).json({
      message: 'Login bem sucedido',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
        email: user.email,
        telefone: user.telefone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno ao efetuar login." });
  }
};

export const getMe = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const query = 'SELECT id, nome, cpf, email, telefone, role, status FROM usuarios WHERE id = $1';
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = `
      SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.role, u.status, u.data_criacao,
             m.crm, m.especialidade, m.instituicao, m.cidade AS med_cidade, m.estado AS med_estado,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade AS pac_cidade, p.estado AS pac_estado, p.pais AS pac_pais
      FROM usuarios u
      LEFT JOIN medicos m ON u.id = m.id_usuario
      LEFT JOIN pacientes p ON u.id = p.id_usuario
      ORDER BY u.data_criacao DESC
    `;
    const result = await db.query(query);

    // Mapear no formato esperado pelo frontend
    const mapped = result.rows.map(row => {
      const user: any = {
        id: row.id,
        nome: row.nome,
        cpf: row.cpf,
        email: row.email,
        telefone: row.telefone,
        role: row.role,
        status: row.status,
        data_criacao: row.data_criacao
      };

      if (row.role === 'medico') {
        user.medicoDetails = {
          crm: row.crm,
          especialidade: row.especialidade,
          instituicao: row.instituicao,
          cidade: row.med_cidade,
          estado: row.med_estado
        };
      }

      if (row.role === 'paciente') {
        user.pacienteDetails = {
          data_nascimento: row.data_nascimento ? new Date(row.data_nascimento).toISOString().split('T')[0] : '',
          sexo_biologico: row.sexo_biologico,
          genero: row.genero,
          sindrome: row.sindrome,
          responsavel_nome: row.responsavel_nome,
          cidade: row.pac_cidade,
          estado: row.pac_estado,
          pais: row.pac_pais
        };
      }

      return user;
    });

    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const update = async (req: Request, res: Response): Promise<any> => {
  const targetId = Number(req.params.id);
  const { nome, email, cpf, telefone, status, role, crm, especialidade, instituicao, adminUser } = req.body;

  if (isNaN(targetId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    // Buscar usuário antigo
    const oldQuery = 'SELECT * FROM usuarios WHERE id = $1';
    const oldRes = await db.query(oldQuery, [targetId]);
    if (oldRes.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const oldUser = oldRes.rows[0];

    // Atualizar tabela usuarios
    const updateQuery = `
      UPDATE usuarios 
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          cpf = COALESCE($3, cpf),
          telefone = COALESCE($4, telefone),
          status = COALESCE($5, status),
          role = COALESCE($6, role)
      WHERE id = $7
    `;
    await db.query(updateQuery, [nome, email, cpf, telefone, status, role, targetId]);

    // Se for médico e tiver CRM/especialidade, atualiza a tabela medicos
    if (role === 'medico' || oldUser.role === 'medico') {
      const checkMedQuery = 'SELECT * FROM medicos WHERE id_usuario = $1';
      const checkMed = await db.query(checkMedQuery, [targetId]);
      if (checkMed.rows.length > 0) {
        const updateMed = `
          UPDATE medicos 
          SET crm = COALESCE($1, crm),
              especialidade = COALESCE($2, especialidade),
              instituicao = COALESCE($3, instituicao)
          WHERE id_usuario = $4
        `;
        await db.query(updateMed, [crm, especialidade, instituicao, targetId]);
      } else {
        const insertMed = `
          INSERT INTO medicos (id_usuario, crm, especialidade, instituicao)
          VALUES ($1, $2, $3, $4)
        `;
        await db.query(insertMed, [targetId, crm || 'CRM-TEMP', especialidade || 'Clínico', instituicao]);
      }
    }

    if (adminUser) {
      await logAction(
        adminUser.id,
        adminUser.nome,
        'Edição de Usuário',
        `Editou o perfil do usuário ${oldUser.nome} (ID: ${oldUser.id}).`
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const remove = async (req: Request, res: Response): Promise<any> => {
  const targetId = Number(req.params.id);
  const { adminUser } = req.body;

  if (isNaN(targetId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const selectQuery = 'SELECT nome, role FROM usuarios WHERE id = $1';
    const selectRes = await db.query(selectQuery, [targetId]);
    if (selectRes.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const user = selectRes.rows[0];

    // Deletar o usuário (ON DELETE CASCADE cuidará das tabelas medicos/pacientes)
    const deleteQuery = 'DELETE FROM usuarios WHERE id = $1';
    await db.query(deleteQuery, [targetId]);

    if (adminUser) {
      await logAction(
        adminUser.id,
        adminUser.nome,
        'Exclusão de Usuário',
        `Excluiu a conta do usuário ${user.nome} (ID: ${targetId}, Role: ${user.role}).`
      );
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
