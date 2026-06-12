CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id_usuario INT PRIMARY KEY,
    crm VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(50),
    CONSTRAINT fk_medico_usuario FOREIGN KEY (id_usuario) 
	REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE pacientes (
    id_usuario INT PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    sexo_biologico CHAR(1) CHECK (sexo_biologico IN ('M', 'F')) NOT NULL,
	genero CHAR(15) CHECK (genero IN ('Feminino', 'Masculino')) NOT NULL,
	sindrome VARCHAR(20) CHECK (sindrome IN ('normal', 'mutacao', 'pre_mutacao')) NOT NULL,
    nome_mae VARCHAR(150),
    nome_pai VARCHAR(150),
    responsavel_nome VARCHAR(150),
    responsavel_parentesco VARCHAR(50),
    responsavel_cpf VARCHAR(14),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    pais VARCHAR(50),
    telefone_2 VARCHAR(20),
    whatsapp VARCHAR(20),
    id_medico_responsavel INT,
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (id_usuario)
	REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_medico_responsavel FOREIGN KEY (id_medico_responsavel)
	REFERENCES medicos(id_usuario) ON DELETE SET NULL
);

CREATE TABLE historico_medico (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL, 
    ja_fez_pcr BOOLEAN DEFAULT FALSE,
    tipo_mutacao VARCHAR(50),
    tem_autismo BOOLEAN DEFAULT FALSE,
    hist_deficiencia_intelectual BOOLEAN DEFAULT FALSE,
    hist_menopausa_precoce BOOLEAN DEFAULT FALSE,
    hist_ataxia BOOLEAN DEFAULT FALSE,
	interesse_exame BOOLEAN DEFAULT FALSE,
    tem_irmaos BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_historico_paciente FOREIGN KEY (id_paciente)
    REFERENCES pacientes(id_usuario) ON DELETE CASCADE
);

CREATE TABLE exame (
    id_documento SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
	id_medico INT NOT NULL,
    tipo_exame VARCHAR(100),
    caminho_arquivo VARCHAR(255) NOT NULL,
    data_upload DATE DEFAULT CURRENT_DATE,
	CONSTRAINT fk_exame_paciente FOREIGN KEY (id_paciente) 
	REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
	CONSTRAINT fk_exame_medico FOREIGN KEY (id_medico) 
	REFERENCES medicos(id_usuario) ON DELETE CASCADE
);

CREATE TABLE funcionarios_ibk (
    id_usuario INT PRIMARY KEY,
    
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (id_usuario) 
	REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE sintomas (
    id SERIAL PRIMARY KEY,
    sintoma VARCHAR(150) NOT NULL,
    score_f DECIMAL(4,2) NOT NULL,
    score_m DECIMAL(4,2) NOT NULL
);

CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT,
    preenchido_por VARCHAR(50) NOT NULL,
    score_final DECIMAL(4,2),
    classificacao VARCHAR(20) DEFAULT 'Negativo',
    memoria_calculo TEXT,
    data_preenchimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_checklist_paciente FOREIGN KEY (id_paciente) 
	REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
	CONSTRAINT fk_checklist_medico FOREIGN KEY (id_medico) 
	REFERENCES medicos(id_usuario) ON DELETE SET NULL
);

-- associativa checklist/sintomas
CREATE TABLE checklist_sintomas (
    id_checklist INT NOT NULL,
    id_sintoma INT NOT NULL,
    possui BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_checklist, id_sintoma),
    CONSTRAINT fk_cs_checklist FOREIGN KEY (id_checklist) REFERENCES checklists(id) ON DELETE CASCADE,
    CONSTRAINT fk_cs_sintoma FOREIGN KEY (id_sintoma) REFERENCES sintomas(id) ON DELETE CASCADE
);

-- notificações PCR para alertas ao instituto/admin
CREATE TABLE notificacoes_pcr (
    id SERIAL PRIMARY KEY,
    id_checklist INT NOT NULL,
    id_paciente INT NOT NULL,
    nome_paciente VARCHAR(255),
    preenchido_por VARCHAR(100),
    score_final DECIMAL(4,2),
    classificacao VARCHAR(20),
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notpcr_checklist FOREIGN KEY (id_checklist) REFERENCES checklists(id) ON DELETE CASCADE,
    CONSTRAINT fk_notpcr_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE
);

-- consultas (independentes de checklists)
CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    id_checklist INT,
    CONSTRAINT fk_consulta_paciente FOREIGN KEY (id_paciente)
	REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_medico FOREIGN KEY (id_medico)
	REFERENCES medicos(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_checklist FOREIGN KEY (id_checklist)
	REFERENCES checklists(id) ON DELETE SET NULL
);

-- sessoes (connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- ── EXTENSÕES DE ARQUITETURA ──

-- Campo de status e token de ativação para suporte à Ativação de Conta (Fluxo 1)
ALTER TABLE usuarios ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING_ACTIVATION', 'ACTIVE'));
ALTER TABLE usuarios ADD COLUMN token_ativacao VARCHAR(100);

-- Tabela para gerenciar solicitações de novos médicos (Fluxo Sou Médico e Aprovação de Médicos)
CREATE TABLE solicitacoes_credenciamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(50),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    instituicao VARCHAR(150),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    motivo_recusa TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para gerenciar solicitações de vínculo médico-paciente (Fluxo 3)
CREATE TABLE vinculos_medicos (
    id SERIAL PRIMARY KEY,
    id_medico INT NOT NULL,
    id_paciente INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING_LINK' CHECK (status IN ('PENDING_LINK', 'LINK_APPROVED', 'LINK_DENIED')),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vinculo_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_vinculo_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uq_medico_paciente UNIQUE (id_medico, id_paciente)
);

-- Tabelas para personalização editável da Landing Page (Cards e Seção de Notícias)
CREATE TABLE landing_cards (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    etiqueta_img VARCHAR(100),
    imagem_url TEXT, -- Base64 ou URL da Imagem carregada
    link_href VARCHAR(255)
);

CREATE TABLE landing_news (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    imagem_url TEXT, -- Base64 ou URL do Destaque
    link_href VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para registros de auditoria administrativa e do sistema
CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    id_usuario INT,
    nome_usuario VARCHAR(100),
    acao VARCHAR(150) NOT NULL,
    detalhes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Role de usuário para suporte aos perfis
ALTER TABLE usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'paciente' CHECK (role IN ('medico', 'instituto', 'paciente', 'admin'));

-- Campos adicionais na tabela medicos
ALTER TABLE medicos ADD COLUMN cidade VARCHAR(100);
ALTER TABLE medicos ADD COLUMN estado VARCHAR(50);
ALTER TABLE medicos ADD COLUMN instituicao VARCHAR(150);

-- Seeder Inicial de Sintomas
INSERT INTO sintomas (sintoma, score_m, score_f) VALUES
('Atraso na fala', 0.14, 0.01),
('Dificuldades de aprendizagem', 0.18, 0.28),
('Déficit de atenção', 0.17, 0.12),
('Deficiência intelectual (DI)', 0.32, 0.20),
('Hiperatividade', 0.12, 0.04),
('Agressividade', 0.01, 0.02),
('Evita contato visual', 0.06, 0.08),
('Evita contato físico', 0.04, 0.07),
('Movimentos intencionais, repetitivos e rítmicos', 0.17, 0.05),
('Hiperflexibilidade articular (hipermobilidade)', 0.19, 0.04),
('Rosto alongado, mandíbula proeminente e/ou orelhas proeminentes', 0.29, 0.09),
('Macroorquidismo', 0.26, 0.00);

-- Seeder Inicial de Usuários (Senhas: 123456)
-- Senha hash gerada para '123456' usando bcryptjs
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha_hash, role, status) VALUES
(1, 'Instituto Buko Kaesemodel', '00000000000', 'instituto@teste.com', '4132220000', '$2a$12$R.S4wN/Lsnf0xI33nO7EpeN2mR2tG0Q1e7jV9/sK2h5fV2Kx0u9Wq', 'instituto', 'ACTIVE'),
(2, 'Dr. André Silva', '12345678901', 'medico@teste.com', '41999999999', '$2a$12$R.S4wN/Lsnf0xI33nO7EpeN2mR2tG0Q1e7jV9/sK2h5fV2Kx0u9Wq', 'medico', 'ACTIVE'),
(3, 'Alice Cooper', '11122233344', 'paciente@teste.com', '11999999999', '$2a$12$R.S4wN/Lsnf0xI33nO7EpeN2mR2tG0Q1e7jV9/sK2h5fV2Kx0u9Wq', 'paciente', 'ACTIVE'),
(4, 'Bob Smith', '22233344455', 'bob@teste.com', '41988888888', '$2a$12$R.S4wN/Lsnf0xI33nO7EpeN2mR2tG0Q1e7jV9/sK2h5fV2Kx0u9Wq', 'paciente', 'ACTIVE'),
(8, 'Administrador Geral', '99999999999', 'admin@teste.com', '4132221111', '$2a$12$R.S4wN/Lsnf0xI33nO7EpeN2mR2tG0Q1e7jV9/sK2h5fV2Kx0u9Wq', 'admin', 'ACTIVE');

-- Ajustar a sequência do ID de usuarios
SELECT setval('usuarios_id_seq', 10);

INSERT INTO medicos (id_usuario, crm, especialidade) VALUES
(2, 'CRM-12345', 'Neuropediatra');

INSERT INTO pacientes (id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, responsavel_nome, responsavel_parentesco, responsavel_cpf, cidade, estado, pais, whatsapp, id_medico_responsavel) VALUES
(3, '1981-05-15', 'F', 'Feminino', 'normal', 'Mary Cooper', 'Mary Cooper', 'Mãe', '00011122233', 'São Paulo', 'SP', 'Brasil', '11999999999', 2),
(4, '1994-09-01', 'M', 'Masculino', 'mutacao', 'Jane Smith', 'Jane Smith', 'Mãe', '11122233344', 'Curitiba', 'PR', 'Brasil', '41988888888', 2);

-- Seeder Inicial de Cards da Landing Page
INSERT INTO landing_cards (id, nome, etiqueta_img, imagem_url, link_href) VALUES
(1, 'Equipe BK', 'Foto equipe', '/equipe.png', 'https://xfragil.org.br/quem-somos/'),
(2, 'Nossa missão', 'Foto missão', '/missao.png', 'https://xfragil.org.br/missao-visao-valores/'),
(3, 'Nosso impacto', 'Foto impacto', '/impacto.png', 'https://xfragil.org.br/projetos/'),
(4, 'Parceiros', 'Foto parceiros', '/parceiros.png', 'https://xfragil.org.br/parceiros/'),
(5, 'Projetos', 'Foto projetos', '/projetos.png', 'https://xfragil.org.br/projetos/'),
(6, 'Voluntários', 'Foto voluntários', '/voluntarios.png', 'https://xfragil.org.br/como-ajudar/');

SELECT setval('landing_cards_id_seq', 7);

-- Seeder Inicial de Notícias
INSERT INTO landing_news (id, titulo, imagem_url, link_href) VALUES
(1, 'Novidades do Instituto Buko Kaesemodel', '', 'https://xfragil.org.br/noticias/');

SELECT setval('landing_news_id_seq', 2);
