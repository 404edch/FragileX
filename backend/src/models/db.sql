CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING_ACTIVATION', 'ACTIVE')),
    token_ativacao VARCHAR(100),
    role VARCHAR(20) DEFAULT 'paciente' CHECK (role IN ('medico', 'instituto', 'paciente', 'admin')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id_usuario INT PRIMARY KEY,
    crm VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(50),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    instituicao VARCHAR(150),
    CONSTRAINT fk_medico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
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
    foto_perfil TEXT,
    encaminhamento_status VARCHAR(50) DEFAULT 'pendente' CHECK (encaminhamento_status IN ('pendente', 'encaminhado', 'encaminhamento negado')),
    classificacao_oficial VARCHAR(50) DEFAULT 'Não Avaliado',
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_medico_responsavel FOREIGN KEY (id_medico_responsavel) REFERENCES medicos(id_usuario) ON DELETE SET NULL
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
    CONSTRAINT fk_historico_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE
);

CREATE TABLE exame (
    id_documento SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    tipo_exame VARCHAR(100),
    caminho_arquivo VARCHAR(255) NOT NULL,
    data_upload DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_exame_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_exame_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario) ON DELETE CASCADE
);

CREATE TABLE funcionarios_ibk (
    id_usuario INT PRIMARY KEY,
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
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
    CONSTRAINT fk_checklist_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_checklist_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_usuario) ON DELETE SET NULL
);

CREATE TABLE checklist_sintomas (
    id_checklist INT NOT NULL,
    id_sintoma INT NOT NULL,
    possui BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_checklist, id_sintoma),
    CONSTRAINT fk_cs_checklist FOREIGN KEY (id_checklist) REFERENCES checklists(id) ON DELETE CASCADE,
    CONSTRAINT fk_cs_sintoma FOREIGN KEY (id_sintoma) REFERENCES sintomas(id) ON DELETE CASCADE
);

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

CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT,
    autor_id INT,
    titulo VARCHAR(100),
    autor_nome VARCHAR(255),
    role_autor VARCHAR(50),
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    id_checklist INT,
    CONSTRAINT fk_consulta_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_consulta_checklist FOREIGN KEY (id_checklist) REFERENCES checklists(id) ON DELETE SET NULL
);

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

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

CREATE TABLE landing_cards (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    etiqueta_img VARCHAR(100),
    imagem_url TEXT,
    link_href VARCHAR(255)
);

CREATE TABLE landing_news (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    imagem_url TEXT,
    link_href VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    id_usuario INT,
    nome_usuario VARCHAR(100),
    acao VARCHAR(150) NOT NULL,
    detalhes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);
