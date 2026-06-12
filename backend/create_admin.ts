import { db } from './src/config/database';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const nome = 'Administrador do Sistema';
    const email = 'admin@teste.com';
    const cpf = '000.000.000-00';
    const senhaStr = 'admin123';
    const telefone = '(00) 00000-0000';
    const role = 'admin';
    const status = 'ACTIVE';

    const check = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      console.log('Usuário admin já existe. Atualizando senha...');
      const hash = await bcrypt.hash(senhaStr, 10);
      await db.query('UPDATE usuarios SET senha_hash = $1, status = $2, role = $3 WHERE email = $4', [hash, status, role, email]);
      console.log('Admin atualizado com sucesso.');
    } else {
      const hash = await bcrypt.hash(senhaStr, 10);
      await db.query(
        'INSERT INTO usuarios (nome, email, cpf, senha_hash, telefone, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [nome, email, cpf, hash, telefone, role, status]
      );
      console.log('Conta admin criada com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
