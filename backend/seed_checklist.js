const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:la1805la@localhost:5432/fragilex' });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Add columns to checklists if they don't exist
    await client.query(`
      ALTER TABLE checklists 
      ADD COLUMN IF NOT EXISTS classificacao VARCHAR(50),
      ADD COLUMN IF NOT EXISTS memoria_calculo TEXT
    `);

    // Delete existing sintomas
    await client.query('DELETE FROM checklist_sintomas'); // foreign key dependency
    await client.query('DELETE FROM sintomas');

    // Insert new sintomas
    const novosSintomas = [
      { sintoma: 'Atraso na fala', score_m: 0.14, score_f: 0.01 },
      { sintoma: 'Dificuldades de aprendizagem', score_m: 0.18, score_f: 0.28 },
      { sintoma: 'Déficit de atenção', score_m: 0.17, score_f: 0.12 },
      { sintoma: 'Deficiência intelectual (DI)', score_m: 0.32, score_f: 0.20 },
      { sintoma: 'Hiperatividade', score_m: 0.12, score_f: 0.04 },
      { sintoma: 'Agressividade', score_m: 0.01, score_f: 0.02 },
      { sintoma: 'Evita contato visual', score_m: 0.06, score_f: 0.08 },
      { sintoma: 'Evita contato físico', score_m: 0.04, score_f: 0.07 },
      { sintoma: 'Movimentos intencionais, repetitivos e rítmicos', score_m: 0.17, score_f: 0.05 },
      { sintoma: 'Hiperflexibilidade articular (hipermobilidade)', score_m: 0.19, score_f: 0.04 },
      { sintoma: 'Rosto alongado, mandíbula proeminente e/ou orelhas proeminentes', score_m: 0.29, score_f: 0.09 },
      { sintoma: 'Macroorquidismo', score_m: 0.26, score_f: 0.00 }
    ];

    for (const [index, s] of novosSintomas.entries()) {
      await client.query(
        'INSERT INTO sintomas (id, sintoma, score_m, score_f) VALUES ($1, $2, $3, $4)',
        [index + 1, s.sintoma, s.score_m, s.score_f]
      );
    }
    
    // Adjust sequence
    await client.query("SELECT setval('sintomas_id_seq', (SELECT MAX(id) FROM sintomas))");

    await client.query('COMMIT');
    console.log('Database updated successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error:', e);
  } finally {
    client.release();
    pool.end();
  }
}

run();
