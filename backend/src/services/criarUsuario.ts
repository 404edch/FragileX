import { db } from "../config/database"
import bcrypt from "bcryptjs"


export const criarUsuario = async (nome: string, email: string, senha: string, cpf: string, telefone: string, ) => {
    try {
        const senhaHash = await bcrypt.hash(senha, 12);
        const query = 'INSERT INTO usuarios (nome, email, senha_hash, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const valores = [nome, email, senhaHash, cpf, telefone];
        const resultado = await db.query(query, valores);
        console.log(resultado.rows[0])
        return resultado.rows[0];

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw new Error('Erro ao criar usuário');
    }}