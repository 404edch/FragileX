import { Request, Response } from "express";
import { db } from "../config/database";

export const getAudits = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = `
      SELECT l.id, l.id_usuario, l.nome_usuario, COALESCE(u.role, 'system') AS role, l.acao, l.detalhes, l.timestamp
      FROM logs_auditoria l
      LEFT JOIN usuarios u ON l.id_usuario = u.id
      ORDER BY l.timestamp DESC
    `;
    const result = await db.query(query);
    const mapped = result.rows.map(r => ({
      id: r.id,
      id_usuario: r.id_usuario,
      nome_usuario: r.nome_usuario,
      role: r.role,
      acao: r.acao,
      detalhes: r.detalhes,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString()
    }));
    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter logs de auditoria:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
