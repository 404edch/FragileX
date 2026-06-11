import { Request, Response } from "express";
import { db } from "../config/database";
import { logAction } from "../services/auditService";

export const getCards = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = "SELECT id, nome, etiqueta_img, imagem_url, link_href FROM landing_cards ORDER BY id ASC";
    const result = await db.query(query);
    const mapped = result.rows.map(r => ({
      id: r.id,
      nome: r.nome,
      etiquetaImg: r.etiqueta_img,
      imagemUrl: r.imagem_url,
      linkHref: r.link_href
    }));
    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter cards da landing page:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const saveCards = async (req: Request, res: Response): Promise<any> => {
  const cards = req.body;
  if (!Array.isArray(cards)) {
    return res.status(400).json({ error: "Cards deve ser um array." });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM landing_cards");

    for (const card of cards) {
      const insertQuery = `
        INSERT INTO landing_cards (id, nome, etiqueta_img, imagem_url, link_href)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(insertQuery, [
        card.id,
        card.nome,
        card.etiquetaImg,
        card.imagemUrl,
        card.linkHref
      ]);
    }

    // Ajustar sequência
    await client.query("SELECT setval('landing_cards_id_seq', COALESCE((SELECT MAX(id) FROM landing_cards), 1))");

    await client.query("COMMIT");

    await logAction(null, 'Administrador/Editor', 'Editar Cards Home', 'Atualizou os cards do carrossel Quem Somos.');

    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar cards da landing page:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  } finally {
    client.release();
  }
};

export const getNews = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = "SELECT id, titulo, imagem_url, link_href FROM landing_news ORDER BY id ASC";
    const result = await db.query(query);
    const mapped = result.rows.map(r => ({
      id: r.id,
      titulo: r.titulo,
      imagemUrl: r.imagem_url,
      linkHref: r.link_href
    }));
    return res.json(mapped);
  } catch (error) {
    console.error("Erro ao obter notícias da landing page:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const saveNews = async (req: Request, res: Response): Promise<any> => {
  const newsList = req.body;
  if (!Array.isArray(newsList)) {
    return res.status(400).json({ error: "Notícias deve ser um array." });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM landing_news");

    for (const news of newsList) {
      const insertQuery = `
        INSERT INTO landing_news (id, titulo, imagem_url, link_href)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(insertQuery, [
        news.id,
        news.titulo,
        news.imagemUrl,
        news.linkHref
      ]);
    }

    // Ajustar sequência
    await client.query("SELECT setval('landing_news_id_seq', COALESCE((SELECT MAX(id) FROM landing_news), 1))");

    await client.query("COMMIT");

    await logAction(null, 'Administrador/Editor', 'Editar Notícias Home', 'Atualizou os destaques e notícias da home.');

    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar notícias da landing page:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  } finally {
    client.release();
  }
};
