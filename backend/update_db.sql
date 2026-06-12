ALTER TABLE pacientes ADD COLUMN foto_perfil TEXT;
ALTER TABLE pacientes ADD COLUMN encaminhamento_status VARCHAR(50) DEFAULT 'pendente' CHECK (encaminhamento_status IN ('pendente', 'encaminhado', 'encaminhamento negado'));
ALTER TABLE pacientes ADD COLUMN classificacao_oficial VARCHAR(50) DEFAULT 'Não Avaliado';

-- [2026-06-12] Alterando tabela consultas para permitir que instituto também adicione notas
ALTER TABLE consultas DROP CONSTRAINT IF EXISTS fk_consulta_medico;
ALTER TABLE consultas ALTER COLUMN id_medico DROP NOT NULL;
ALTER TABLE consultas ADD COLUMN autor_id INT;
ALTER TABLE consultas ADD CONSTRAINT fk_consulta_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE;
ALTER TABLE consultas ADD COLUMN titulo VARCHAR(100);
ALTER TABLE consultas ADD COLUMN autor_nome VARCHAR(255);
ALTER TABLE consultas ADD COLUMN role_autor VARCHAR(50);
