import {db} from "../config/database"
import bcrypt from "bcryptjs";

export const logarUsuario = async (usuario: string, senha: string) => {
    try {
        const query = 'SELECT senha_hash FROM usuarios WHERE email = $1 OR cpf = $1';
        const valores = [usuario];
        const resultado = await db.query(query, valores);
        if (resultado.rowCount !== null && resultado.rowCount > 0) {
            const senhaHash = resultado.rows[0].senha_hash;
            const senhaValida = await bcrypt.compare(senha, senhaHash);
            return senhaValida;
        } else return false;

    } catch (error) {
        console.error('Erro ao logar usuário:', error);
        throw new Error('Erro ao logar usuário');
    }


}