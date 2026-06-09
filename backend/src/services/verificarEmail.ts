import { resolve } from "node:dns";
import { db } from "../config/database";

export const verificarEmail = async (email: string): Promise<boolean> => {
    try {

    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const valores = [email];
    const resultado = await db.query(query, valores);
    console.log(resultado.rowCount)
    if (resultado.rowCount === null || resultado.rowCount <= 0) return false;
    return true;
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        throw new Error('Erro ao verificar email');
    }
}