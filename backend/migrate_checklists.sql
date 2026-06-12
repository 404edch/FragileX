-- Add missing columns to checklists table
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS classificacao VARCHAR(20) DEFAULT 'Negativo';
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS memoria_calculo TEXT;

-- Create notifications table for PCR alerts
CREATE TABLE IF NOT EXISTS notificacoes_pcr (
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
