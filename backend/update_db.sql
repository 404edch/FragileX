ALTER TABLE pacientes ADD COLUMN foto_perfil TEXT;
ALTER TABLE pacientes ADD COLUMN encaminhamento_status VARCHAR(50) DEFAULT 'pendente' CHECK (encaminhamento_status IN ('pendente', 'encaminhado', 'encaminhamento negado'));
ALTER TABLE pacientes ADD COLUMN classificacao_oficial VARCHAR(50) DEFAULT 'Não Avaliado';
