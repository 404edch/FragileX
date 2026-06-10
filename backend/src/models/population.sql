INSERT INTO sintomas (sintoma, score_m, score_f) VALUES
('Atraso na fala', 0.14, 0.01),
('Dificuldades de aprendizado', 0.18, 0.28),
('Déficit de atenção', 0.17, 0.12),
('Deficiência intelectual (ID)', 0.32, 0.20),
('Hiperatividade', 0.12, 0.04),
('Agressividade', 0.01, 0.02),
('Evita contato visual', 0.06, 0.08),
('Evita contato físico', 0.04, 0.07),
('Movimentos intencionais, repetitivos e rítmicos', 0.17, 0.05),
('Hiperflexibilidade articular (hipermobilidade)', 0.19, 0.04),
('Macroorquidia', 0.26, 0.00),
('Face alongada, mandíbula proeminente e/ou orelhas de abano', 0.29, 0.09);

-- ============================================================================
-- 1. USUÁRIOS (50 registros manuais)
-- ============================================================================
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha_hash) VALUES
(1, 'Dr. Roberto Almeida', '11111111101', 'm1@medico.com', '41900000001', 'hash'),
(2, 'Dra. Camila Santos', '11111111102', 'm2@medico.com', '41900000002', 'hash'),
(3, 'Dr. Fernando Costa', '11111111103', 'm3@medico.com', '41900000003', 'hash'),
(4, 'Dra. Julia Martins', '11111111104', 'm4@medico.com', '41900000004', 'hash'),
(5, 'Dr. Renato Souza', '11111111105', 'm5@medico.com', '41900000005', 'hash'),
(6, 'Ana Silva (IBK)', '22222222201', 'f1@ibk.com', '41900000006', 'hash'),
(7, 'Carlos Gomes (IBK)', '22222222202', 'f2@ibk.com', '41900000007', 'hash'),
(8, 'Paciente 8', '33333333308', 'p8@email.com', '41900000008', 'hash'),
(9, 'Paciente 9', '33333333309', 'p9@email.com', '41900000009', 'hash'),
(10, 'Paciente 10', '33333333310', 'p10@email.com', '41900000010', 'hash'),
(11, 'Paciente 11', '33333333311', 'p11@email.com', '41900000011', 'hash'),
(12, 'Paciente 12', '33333333312', 'p12@email.com', '41900000012', 'hash'),
(13, 'Paciente 13', '33333333313', 'p13@email.com', '41900000013', 'hash'),
(14, 'Paciente 14', '33333333314', 'p14@email.com', '41900000014', 'hash'),
(15, 'Paciente 15', '33333333315', 'p15@email.com', '41900000015', 'hash'),
(16, 'Paciente 16', '33333333316', 'p16@email.com', '41900000016', 'hash'),
(17, 'Paciente 17', '33333333317', 'p17@email.com', '41900000017', 'hash'),
(18, 'Paciente 18', '33333333318', 'p18@email.com', '41900000018', 'hash'),
(19, 'Paciente 19', '33333333319', 'p19@email.com', '41900000019', 'hash'),
(20, 'Paciente 20', '33333333320', 'p20@email.com', '41900000020', 'hash'),
(21, 'Paciente 21', '33333333321', 'p21@email.com', '41900000021', 'hash'),
(22, 'Paciente 22', '33333333322', 'p22@email.com', '41900000022', 'hash'),
(23, 'Paciente 23', '33333333323', 'p23@email.com', '41900000023', 'hash'),
(24, 'Paciente 24', '33333333324', 'p24@email.com', '41900000024', 'hash'),
(25, 'Paciente 25', '33333333325', 'p25@email.com', '41900000025', 'hash'),
(26, 'Paciente 26', '33333333326', 'p26@email.com', '41900000026', 'hash'),
(27, 'Paciente 27', '33333333327', 'p27@email.com', '41900000027', 'hash'),
(28, 'Paciente 28', '33333333328', 'p28@email.com', '41900000028', 'hash'),
(29, 'Paciente 29', '33333333329', 'p29@email.com', '41900000029', 'hash'),
(30, 'Paciente 30', '33333333330', 'p30@email.com', '41900000030', 'hash'),
(31, 'Paciente 31', '33333333331', 'p31@email.com', '41900000031', 'hash'),
(32, 'Paciente 32', '33333333332', 'p32@email.com', '41900000032', 'hash'),
(33, 'Paciente 33', '33333333333', 'p33@email.com', '41900000033', 'hash'),
(34, 'Paciente 34', '33333333334', 'p34@email.com', '41900000034', 'hash'),
(35, 'Paciente 35', '33333333335', 'p35@email.com', '41900000035', 'hash'),
(36, 'Paciente 36', '33333333336', 'p36@email.com', '41900000036', 'hash'),
(37, 'Paciente 37', '33333333337', 'p37@email.com', '41900000037', 'hash'),
(38, 'Paciente 38', '33333333338', 'p38@email.com', '41900000038', 'hash'),
(39, 'Paciente 39', '33333333339', 'p39@email.com', '41900000039', 'hash'),
(40, 'Paciente 40', '33333333340', 'p40@email.com', '41900000040', 'hash'),
(41, 'Paciente 41', '33333333341', 'p41@email.com', '41900000041', 'hash'),
(42, 'Paciente 42', '33333333342', 'p42@email.com', '41900000042', 'hash'),
(43, 'Paciente 43', '33333333343', 'p43@email.com', '41900000043', 'hash'),
(44, 'Paciente 44', '33333333344', 'p44@email.com', '41900000044', 'hash'),
(45, 'Paciente 45', '33333333345', 'p45@email.com', '41900000045', 'hash'),
(46, 'Paciente 46', '33333333346', 'p46@email.com', '41900000046', 'hash'),
(47, 'Paciente 47', '33333333347', 'p47@email.com', '41900000047', 'hash'),
(48, 'Paciente 48', '33333333348', 'p48@email.com', '41900000048', 'hash'),
(49, 'Paciente 49', '33333333349', 'p49@email.com', '41900000049', 'hash'),
(50, 'Paciente 50', '33333333350', 'p50@email.com', '41900000050', 'hash');

-- ============================================================================
-- 2. MÉDICOS E FUNCIONÁRIOS
-- ============================================================================
INSERT INTO medicos (id_usuario, crm, especialidade) VALUES
(1, '12345-PR', 'Neurologia'),
(2, '23456-PR', 'Genética Médica'),
(3, '34567-PR', 'Pediatria'),
(4, '45678-PR', 'Psiquiatria'),
(5, '56789-PR', 'Clínica Geral');

INSERT INTO funcionarios_ibk (id_usuario) VALUES 
(6), 
(7);

-- ============================================================================
-- 3. PACIENTES
-- ============================================================================
INSERT INTO pacientes (id_usuario, data_nascimento, sexo_biologico, genero, sindrome) VALUES
(8, '1990-05-12', 'F', 'Feminino', 'normal'),
(9, '1985-08-22', 'M', 'Masculino', 'pre_mutacao'),
(10, '2000-01-15', 'M', 'Masculino', 'mutacao'),
(11, '1975-11-30', 'F', 'Feminino', 'pre_mutacao'),
(12, '1992-04-18', 'M', 'Masculino', 'normal'),
(13, '1988-09-05', 'F', 'Feminino', 'mutacao'),
(14, '1995-12-25', 'M', 'Masculino', 'pre_mutacao'),
(15, '1982-03-14', 'F', 'Feminino', 'normal'),
(16, '1979-07-08', 'M', 'Masculino', 'mutacao'),
(17, '2001-02-28', 'F', 'Feminino', 'pre_mutacao'),
(18, '1994-06-19', 'M', 'Masculino', 'normal'),
(19, '1987-10-10', 'F', 'Feminino', 'mutacao'),
(20, '1980-05-23', 'M', 'Masculino', 'pre_mutacao'),
(21, '1998-08-11', 'F', 'Feminino', 'normal'),
(22, '1991-01-04', 'M', 'Masculino', 'mutacao'),
(23, '1984-11-17', 'F', 'Feminino', 'pre_mutacao'),
(24, '1976-04-02', 'M', 'Masculino', 'normal'),
(25, '2003-09-29', 'F', 'Feminino', 'mutacao'),
(26, '1989-12-15', 'M', 'Masculino', 'pre_mutacao'),
(27, '1996-03-08', 'F', 'Feminino', 'normal'),
(28, '1981-07-21', 'M', 'Masculino', 'mutacao'),
(29, '1978-02-14', 'F', 'Feminino', 'pre_mutacao'),
(30, '2002-06-05', 'M', 'Masculino', 'normal'),
(31, '1993-10-27', 'F', 'Feminino', 'mutacao'),
(32, '1986-05-09', 'M', 'Masculino', 'pre_mutacao'),
(33, '1997-08-30', 'F', 'Feminino', 'normal'),
(34, '1990-01-22', 'M', 'Masculino', 'mutacao'),
(35, '1983-11-12', 'F', 'Feminino', 'pre_mutacao'),
(36, '1977-04-26', 'M', 'Masculino', 'normal'),
(37, '2004-09-18', 'F', 'Feminino', 'mutacao'),
(38, '1988-12-07', 'M', 'Masculino', 'pre_mutacao'),
(39, '1995-03-31', 'F', 'Feminino', 'normal'),
(40, '1982-07-13', 'M', 'Masculino', 'mutacao'),
(41, '1979-02-04', 'F', 'Feminino', 'pre_mutacao'),
(42, '2000-06-25', 'M', 'Masculino', 'normal'),
(43, '1992-10-16', 'F', 'Feminino', 'mutacao'),
(44, '1985-05-02', 'M', 'Masculino', 'pre_mutacao'),
(45, '1999-08-24', 'F', 'Feminino', 'normal'),
(46, '1991-01-14', 'M', 'Masculino', 'mutacao'),
(47, '1984-11-06', 'F', 'Feminino', 'pre_mutacao'),
(48, '1976-04-20', 'M', 'Masculino', 'normal'),
(49, '2003-09-11', 'F', 'Feminino', 'mutacao'),
(50, '1989-12-03', 'M', 'Masculino', 'pre_mutacao');

-- ============================================================================
-- 4. HISTÓRICO MÉDICO
-- ============================================================================
INSERT INTO historico_medico (id_paciente, ja_fez_pcr, tipo_mutacao, tem_autismo, hist_deficiencia_intelectual, hist_menopausa_precoce, hist_ataxia, interesse_exame) VALUES
(8, false, NULL, false, false, false, false, true),
(9, true, 'Pré-Mutação', false, false, false, false, true),
(10, true, 'Mutação Completa', false, false, false, false, true),
(11, true, 'Pré-Mutação', false, false, true, false, true),
(12, false, NULL, true, false, false, false, true),
(13, true, 'Mutação Completa', false, false, false, false, true),
(14, true, 'Pré-Mutação', false, false, false, true, true),
(15, false, NULL, false, true, false, false, true),
(16, true, 'Mutação Completa', false, false, false, false, true),
(17, true, 'Pré-Mutação', false, false, true, false, true),
(18, false, NULL, false, false, false, false, true),
(19, true, 'Mutação Completa', true, false, false, false, true),
(20, true, 'Pré-Mutação', false, false, false, false, true),
(21, false, NULL, false, false, false, true, true),
(22, true, 'Mutação Completa', false, true, false, false, true),
(23, true, 'Pré-Mutação', false, false, true, false, true),
(24, false, NULL, false, false, false, false, true),
(25, true, 'Mutação Completa', false, false, false, false, true),
(26, true, 'Pré-Mutação', true, false, false, false, true),
(27, false, NULL, false, false, false, false, true),
(28, true, 'Mutação Completa', false, false, false, true, true),
(29, true, 'Pré-Mutação', false, true, true, false, true),
(30, false, NULL, false, false, false, false, true),
(31, true, 'Mutação Completa', false, false, false, false, true),
(32, true, 'Pré-Mutação', false, false, false, false, true),
(33, false, NULL, true, false, false, false, true),
(34, true, 'Mutação Completa', false, false, false, false, true),
(35, true, 'Pré-Mutação', false, false, true, true, true),
(36, false, NULL, false, true, false, false, true),
(37, true, 'Mutação Completa', false, false, false, false, true),
(38, true, 'Pré-Mutação', false, false, false, false, true),
(39, false, NULL, false, false, false, false, true),
(40, true, 'Mutação Completa', true, false, false, false, true),
(41, true, 'Pré-Mutação', false, false, true, false, true),
(42, false, NULL, false, false, false, true, true),
(43, true, 'Mutação Completa', false, true, false, false, true),
(44, true, 'Pré-Mutação', false, false, false, false, true),
(45, false, NULL, false, false, false, false, true),
(46, true, 'Mutação Completa', false, false, false, false, true),
(47, true, 'Pré-Mutação', true, false, true, false, true),
(48, false, NULL, false, false, false, false, true),
(49, true, 'Mutação Completa', false, false, false, true, true),
(50, true, 'Pré-Mutação', false, true, false, false, true);

-- ============================================================================
-- 5. AJUSTAR AS SEQUENCES (Para os próximos cadastros manuais do seu app)
-- ============================================================================
SELECT setval('usuarios_id_seq', 50);
-- ============================================================================
-- 1. REPOPULAR SINTOMAS (Garante que os IDs serão de 1 a 12)
-- ============================================================================
TRUNCATE TABLE sintomas CASCADE;

INSERT INTO sintomas (id, sintoma, score_f, score_m) VALUES
(1, 'Atraso na fala', 0.14, 0.01),
(2, 'Dificuldades de aprendizado', 0.18, 0.28),
(3, 'Déficit de atenção', 0.17, 0.12),
(4, 'Deficiência intelectual (ID)', 0.32, 0.20),
(5, 'Hiperatividade', 0.12, 0.04),
(6, 'Agressividade', 0.01, 0.02),
(7, 'Evita contato visual', 0.06, 0.08),
(8, 'Evita contato físico', 0.04, 0.07),
(9, 'Movimentos intencionais, repetitivos e rítmicos', 0.17, 0.05),
(10, 'Hiperflexibilidade articular (hipermobilidade)', 0.19, 0.04),
(11, 'Macroorquidia', 0.26, 0.00),
(12, 'Face alongada, mandíbula proeminente e/ou orelhas de abano', 0.29, 0.09);

-- Ajusta a sequence da tabela sintomas
SELECT setval('sintomas_id_seq', 12);

-- ============================================================================
-- 2. CRIAR 1 CHECKLIST PARA CADA PACIENTE (IDs 8 a 50)
-- ============================================================================
-- Vamos simular que todos os 43 pacientes passaram por avaliação médica
INSERT INTO checklists (id, id_paciente, id_medico, preenchido_por, score_final) VALUES
(1, 8, 1, 'Médico', 0.00),
(2, 9, 2, 'Médico', 0.00),
(3, 10, 3, 'Médico', 0.00),
(4, 11, 4, 'Médico', 0.00),
(5, 12, 5, 'Médico', 0.00),
(6, 13, 1, 'Médico', 0.00),
(7, 14, 2, 'Médico', 0.00),
(8, 15, 3, 'Médico', 0.00),
(9, 16, 4, 'Médico', 0.00),
(10, 17, 5, 'Médico', 0.00),
(11, 18, 1, 'Responsável', 0.00),
(12, 19, 2, 'Médico', 0.00),
(13, 20, 3, 'Médico', 0.00),
(14, 21, 4, 'Responsável', 0.00),
(15, 22, 5, 'Médico', 0.00),
(16, 23, 1, 'Médico', 0.00),
(17, 24, 2, 'Médico', 0.00),
(18, 25, 3, 'Responsável', 0.00),
(19, 26, 4, 'Médico', 0.00),
(20, 27, 5, 'Médico', 0.00),
(21, 28, 1, 'Médico', 0.00),
(22, 29, 2, 'Responsável', 0.00),
(23, 30, 3, 'Médico', 0.00),
(24, 31, 4, 'Médico', 0.00),
(25, 32, 5, 'Médico', 0.00),
(26, 33, 1, 'Médico', 0.00),
(27, 34, 2, 'Médico', 0.00),
(28, 35, 3, 'Responsável', 0.00),
(29, 36, 4, 'Médico', 0.00),
(30, 37, 5, 'Médico', 0.00),
(31, 38, 1, 'Médico', 0.00),
(32, 39, 2, 'Médico', 0.00),
(33, 40, 3, 'Médico', 0.00),
(34, 41, 4, 'Responsável', 0.00),
(35, 42, 5, 'Médico', 0.00),
(36, 43, 1, 'Médico', 0.00),
(37, 44, 2, 'Médico', 0.00),
(38, 45, 3, 'Responsável', 0.00),
(39, 46, 4, 'Médico', 0.00),
(40, 47, 5, 'Médico', 0.00),
(41, 48, 1, 'Médico', 0.00),
(42, 49, 2, 'Médico', 0.00),
(43, 50, 3, 'Responsável', 0.00);

-- Ajusta a sequence da tabela checklists
SELECT setval('checklists_id_seq', 43);

-- ============================================================================
-- 3. VINCULAR SINTOMAS AOS CHECKLISTS (Geração Automática)
-- ============================================================================
-- Este comando cruza os 43 checklists com os 12 sintomas (516 registros)
-- e usa uma lógica matemática simples para distribuir TRUE e FALSE.
INSERT INTO checklist_sintomas (id_checklist, id_sintoma, possui)
SELECT 
    c.id, 
    s.id, 
    CASE WHEN (c.id + s.id) % 4 = 0 THEN TRUE ELSE FALSE END
FROM checklists c
CROSS JOIN sintomas s;