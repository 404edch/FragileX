import { Request, Response } from "express";
import { db } from "../config/database";

export const adicionarNota = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.idPaciente);
  const { observacoes, idAutor, nomeAutor, roleAutor } = req.body;

  if (isNaN(idPaciente) || !observacoes || !idAutor) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  try {
    // Buscar quantas consultas esse paciente já tem para gerar o título sequencial
    const countQuery = "SELECT COUNT(*) FROM consultas WHERE id_paciente = $1";
    const countRes = await db.query(countQuery, [idPaciente]);
    const numConsultas = parseInt(countRes.rows[0].count, 10);
    const titulo = `Consulta ${numConsultas + 1}`;

    const insertQuery = `
      INSERT INTO consultas (id_paciente, autor_id, autor_nome, role_autor, titulo, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, id_paciente, autor_id, autor_nome, role_autor, titulo, observacoes, data_consulta
    `;
    const result = await db.query(insertQuery, [idPaciente, idAutor, nomeAutor, roleAutor, titulo, observacoes]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao adicionar nota:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listarNotasPaciente = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.idPaciente);

  if (isNaN(idPaciente)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const query = `
      SELECT id, id_paciente, autor_id, autor_nome, role_autor, titulo, observacoes, data_consulta
      FROM consultas
      WHERE id_paciente = $1
      ORDER BY data_consulta DESC
    `;
    const result = await db.query(query, [idPaciente]);
    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar notas:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
