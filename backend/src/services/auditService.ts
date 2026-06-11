import { db } from "../config/database";

export const logAction = async (idUsuario: number | null, nomeUsuario: string, acao: string, detalhes: string) => {
  try {
    const query = 'INSERT INTO logs_auditoria (id_usuario, nome_usuario, acao, detalhes) VALUES ($1, $2, $3, $4)';
    await db.query(query, [idUsuario, nomeUsuario, acao, detalhes]);
  } catch (error) {
    console.error('Erro ao gravar log de auditoria no PostgreSQL:', error);
  }
};
