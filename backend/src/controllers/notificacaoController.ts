import { Request, Response } from "express";
import { db } from "../config/database";

export const getNotificacoesPCR = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = `
      SELECT id, id_checklist, id_paciente, nome_paciente, preenchido_por, 
             score_final, classificacao, lida, data_criacao
      FROM notificacoes_pcr
      ORDER BY data_criacao DESC
    `;
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar notificações PCR:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
};

export const getNotificacoesPCRCount = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await db.query("SELECT COUNT(*) as count FROM notificacoes_pcr WHERE lida = false");
    return res.json({ count: Number(result.rows[0].count) });
  } catch (error) {
    console.error("Erro ao contar notificações PCR:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
};

export const marcarNotificacaoLida = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });
  
  try {
    await db.query("UPDATE notificacoes_pcr SET lida = true WHERE id = $1", [id]);
    return res.json({ success: true });
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
};
