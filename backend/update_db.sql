CREATE TABLE paciente_fotos (
    id SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    foto_url TEXT NOT NULL,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pf_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_usuario) ON DELETE CASCADE
);
