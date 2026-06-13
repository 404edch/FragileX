
DELETE FROM landing_cards;
INSERT INTO landing_cards (id, nome, etiqueta_img, imagem_url, link_href) VALUES 
(1, 'A Síndrome do X Frágil', 'Imagem', 'https://picsum.photos/seed/card1/400/300', 'https://buko.org.br/sobre/'),
(2, 'Diagnóstico Precoce', 'Pesquisa', 'https://picsum.photos/seed/card2/400/300', 'https://buko.org.br/diagnostico/'),
(3, 'Nossas Campanhas', 'Ação', 'https://picsum.photos/seed/card3/400/300', 'https://buko.org.br/campanhas/'),
(4, 'O que é a Mutação', 'Educação', 'https://picsum.photos/seed/card4/400/300', 'https://buko.org.br/mutacao/'),
(5, 'Tratamento', 'Saúde', 'https://picsum.photos/seed/card5/400/300', 'https://buko.org.br/tratamento/'),
(6, 'Famílias', 'Apoio', 'https://picsum.photos/seed/card6/400/300', 'https://buko.org.br/familias/'),
(7, 'Escolas e Professores', 'Educação', 'https://picsum.photos/seed/card7/400/300', 'https://buko.org.br/escolas/'),
(8, 'Profissionais de Saúde', 'Médico', 'https://picsum.photos/seed/card8/400/300', 'https://buko.org.br/profissionais/'),
(9, 'Seja um Voluntário', 'Ação', 'https://picsum.photos/seed/card9/400/300', 'https://buko.org.br/voluntario/'),
(10, 'Doações', 'Apoio', 'https://picsum.photos/seed/card10/400/300', 'https://buko.org.br/doacoes/');
SELECT setval('landing_cards_id_seq', 10);

DELETE FROM landing_news;
INSERT INTO landing_news (id, titulo, link_href, imagem_url) VALUES 
(1, 'Congresso Internacional de Genética 2026', 'https://buko.org.br/news1', 'https://picsum.photos/seed/news1/400/300'),
(2, 'Novo Tratamento Aprovado pela ANVISA', 'https://buko.org.br/news2', 'https://picsum.photos/seed/news2/400/300'),
(3, 'Semana de Conscientização da Síndrome do X Frágil', 'https://buko.org.br/news3', 'https://picsum.photos/seed/news3/400/300'),
(4, 'Lançamento do App EudigoX', 'https://buko.org.br/news4', 'https://picsum.photos/seed/news4/400/300'),
(5, 'Parceria com Hospitais de Curitiba', 'https://buko.org.br/news5', 'https://picsum.photos/seed/news5/400/300');
SELECT setval('landing_news_id_seq', 5);

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
(1, 'Instituto Buko Kaesemodel', '00000000000', 'instituto@teste.com', '4132220000', '$2b$10$viszJ0tyIuOn08z0iUR3wOfzhX5Ei.49Z/Jcyet6s0TMC0AeIXLg6', 'instituto', 'ACTIVE'),
(2, 'Dr. André Silva', '12345678901', 'medico@teste.com', '41999999999', '$2b$10$viszJ0tyIuOn08z0iUR3wOfzhX5Ei.49Z/Jcyet6s0TMC0AeIXLg6', 'medico', 'ACTIVE'),
(3, 'Alice Cooper', '11122233344', 'paciente@teste.com', '11999999999', '$2b$10$viszJ0tyIuOn08z0iUR3wOfzhX5Ei.49Z/Jcyet6s0TMC0AeIXLg6', 'paciente', 'ACTIVE'),
(4, 'Bob Smith', '22233344455', 'bob@teste.com', '41988888888', '$2b$10$viszJ0tyIuOn08z0iUR3wOfzhX5Ei.49Z/Jcyet6s0TMC0AeIXLg6', 'paciente', 'ACTIVE'),
(8, 'Administrador Geral', '99999999999', 'admin@teste.com', '4132221111', '$2b$10$viszJ0tyIuOn08z0iUR3wOfzhX5Ei.49Z/Jcyet6s0TMC0AeIXLg6', 'admin', 'ACTIVE');

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
-- Inserir dados realistas no banco de dados (FragileX)
-- Preserva usuários de teste atuais (usando IDs a partir de 1000 para evitar colisão)
-- A senha de todos é '123456' (bcrypt hash)

-- ==========================================
-- 1. INSTITUTO BUKO
-- ==========================================
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha_hash, role) VALUES 
(1001, 'Rafaela Kaesemodel', '10100000001', 'rafaela@bukoinstituto.org', '41999990001', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto'),
(1002, 'Sabrina P. Muggiati', '10200000002', 'sabrina@bukoinstituto.org', '41999990002', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto'),
(1003, 'Luz María Romero', '10300000003', 'luzmaria@bukoinstituto.org', '41999990003', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto'),
(1004, 'Ítala Fabiana Santos do Nascimento', '10400000004', 'itala@bukoinstituto.org', '41999990004', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto'),
(1005, 'Sonia Mara Rocha', '10500000005', 'sonia@bukoinstituto.org', '41999990005', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto'),
(1006, 'Beatriz Aleixo', '10600000006', 'beatriz@bukoinstituto.org', '41999990006', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'instituto')
ON CONFLICT (id) DO NOTHING;

INSERT INTO funcionarios_ibk (id_usuario) VALUES 
(1001), (1002), (1003), (1004), (1005), (1006)
ON CONFLICT (id_usuario) DO NOTHING;

-- ==========================================
-- 2. MÉDICOS (10)
-- ==========================================
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha_hash, role) VALUES 
(1201, 'Dr. Andrey Cabral Meira', '20100000001', 'andrey.meira@clinica.com.br', '41988880001', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1202, 'Dr. Roberto H. Herai', '20200000002', 'roberto.herai@genetica.com.br', '41988880002', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1203, 'Dra. Camila Assis Ribeiro', '20300000003', 'camila.assis@neuro.com.br', '41988880003', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1204, 'Dr. Fernando Gomes Pinto', '20400000004', 'fernando.gomes@pediatria.com.br', '41988880004', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1205, 'Dra. Juliana Marques', '20500000005', 'juliana.marques@genetica.com.br', '41988880005', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1206, 'Dr. Marcos Silva Costa', '20600000006', 'marcos.costa@psiquiatria.com.br', '41988880006', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1207, 'Dra. Letícia Carvalho', '20700000007', 'leticia.carvalho@neuro.com.br', '41988880007', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1208, 'Dr. Paulo Ricardo Alves', '20800000008', 'paulo.alves@clinica.com.br', '41988880008', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1209, 'Dra. Vanessa Lima', '20900000009', 'vanessa.lima@pediatria.com.br', '41988880009', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico'),
(1210, 'Dr. Thiago Moraes', '21000000010', 'thiago.moraes@genetica.com.br', '41988880010', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'medico')
ON CONFLICT (id) DO NOTHING;

INSERT INTO medicos (id_usuario, crm, especialidade, cidade, estado, instituicao) VALUES 
(1201, 'CRM-PR 12345', 'Neurologia', 'Curitiba', 'PR', 'Hospital das Clínicas'),
(1202, 'CRM-PR 54321', 'Genética Médica', 'Curitiba', 'PR', 'Instituto Buko'),
(1203, 'CRM-SP 98765', 'Neuropediatria', 'São Paulo', 'SP', 'Hospital Sírio-Libanês'),
(1204, 'CRM-RJ 11223', 'Pediatria', 'Rio de Janeiro', 'RJ', 'Clínica Infantil RJ'),
(1205, 'CRM-MG 44556', 'Genética Clínica', 'Belo Horizonte', 'MG', 'Hospital Mater Dei'),
(1206, 'CRM-RS 77889', 'Psiquiatria Infantil', 'Porto Alegre', 'RS', 'Hospital Moinhos de Vento'),
(1207, 'CRM-PR 33445', 'Neurologia', 'Londrina', 'PR', 'Clínica Neuro PR'),
(1208, 'CRM-SC 66778', 'Pediatria', 'Florianópolis', 'SC', 'Hospital Infantil Joana de Gusmão'),
(1209, 'CRM-BA 99001', 'Genética Médica', 'Salvador', 'BA', 'Hospital Aliança'),
(1210, 'CRM-PE 22334', 'Psiquiatria', 'Recife', 'PE', 'Real Hospital Português')
ON CONFLICT (id_usuario) DO NOTHING;

-- ==========================================
-- 3. PACIENTES (20)
-- ==========================================
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha_hash, role) VALUES 
(1101, 'Jorge Muggiati', '30100000001', 'jorge@paciente.com', '41977770001', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1102, 'Bruno Rogerio Coutinho Moretoni', '30200000002', 'bruno@paciente.com', '41977770002', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1103, 'Eduardo Henrique Chechin Teixeira', '30300000003', 'eduardo@paciente.com', '41977770003', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1104, 'Lunna Damo Perera', '30400000004', 'lunna@paciente.com', '41977770004', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1105, 'Matheus Silva Santos', '30500000005', 'matheus@paciente.com', '41977770005', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1106, 'Lucas Ferreira Oliveira', '30600000006', 'lucas@paciente.com', '41977770006', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1107, 'Pedro Henrique Costa', '30700000007', 'pedro@paciente.com', '41977770007', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1108, 'Gabriel Almeida', '30800000008', 'gabriel@paciente.com', '41977770008', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1109, 'Rafael Souza Martins', '30900000009', 'rafael@paciente.com', '41977770009', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1110, 'Felipe Lima', '31000000010', 'felipe@paciente.com', '41977770010', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1111, 'Thiago Gomes', '31100000011', 'thiago@paciente.com', '41977770011', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1112, 'João Vítor Carvalho', '31200000012', 'joaovitor@paciente.com', '41977770012', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1113, 'Ana Beatriz Rodrigues', '31300000013', 'anabeatriz@paciente.com', '41977770013', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1114, 'Mariana Alves', '31400000014', 'mariana@paciente.com', '41977770014', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1115, 'Isabela Fernandes', '31500000015', 'isabela@paciente.com', '41977770015', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1116, 'Guilherme Rocha', '31600000016', 'guilherme@paciente.com', '41977770016', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1117, 'Gustavo Barbosa', '31700000017', 'gustavo@paciente.com', '41977770017', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1118, 'Caio Ribeiro', '31800000018', 'caio@paciente.com', '41977770018', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1119, 'Arthur Mendes', '31900000019', 'arthur@paciente.com', '41977770019', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente'),
(1120, 'Davi Lucca Pinto', '32000000020', 'davi@paciente.com', '41977770020', '$2a$08$CFa./J5lI0VdYF2uU.xBx.tTzZ8Y4QW3E/P6YQ1k4z/KzEw/ZkSJW', 'paciente')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pacientes (id_usuario, data_nascimento, sexo_biologico, genero, sindrome, nome_mae, nome_pai, responsavel_nome, responsavel_parentesco, cidade, estado, pais, id_medico_responsavel) VALUES 
(1101, '2008-05-15', 'M', 'Masculino', 'mutacao', 'Sabrina P. Muggiati', 'Pai do Jorge', 'Sabrina P. Muggiati', 'Mãe', 'Curitiba', 'PR', 'Brasil', 1202),
(1102, '2010-08-22', 'M', 'Masculino', 'pre_mutacao', 'Mãe do Bruno', 'Pai do Bruno', 'Mãe do Bruno', 'Mãe', 'Curitiba', 'PR', 'Brasil', 1202),
(1103, '2012-11-10', 'M', 'Masculino', 'mutacao', 'Mãe do Eduardo', 'Pai do Eduardo', 'Mãe do Eduardo', 'Mãe', 'São Paulo', 'SP', 'Brasil', 1201),
(1104, '2005-02-28', 'F', 'Feminino', 'mutacao', 'Mãe da Lunna', 'Pai da Lunna', 'Própria', 'Paciente', 'Curitiba', 'PR', 'Brasil', 1201),
(1105, '2015-04-10', 'M', 'Masculino', 'mutacao', 'Ana Silva', 'Carlos Santos', 'Ana Silva', 'Mãe', 'Campinas', 'SP', 'Brasil', 1203),
(1106, '2016-09-05', 'M', 'Masculino', 'normal', 'Paula Ferreira', 'Ricardo Oliveira', 'Paula Ferreira', 'Mãe', 'Belo Horizonte', 'MG', 'Brasil', 1204),
(1107, '2014-12-12', 'M', 'Masculino', 'pre_mutacao', 'Juliana Costa', 'Marcos Costa', 'Juliana Costa', 'Mãe', 'Porto Alegre', 'RS', 'Brasil', 1205),
(1108, '2011-03-20', 'M', 'Masculino', 'mutacao', 'Camila Almeida', 'Roberto Almeida', 'Camila Almeida', 'Mãe', 'Rio de Janeiro', 'RJ', 'Brasil', 1206),
(1109, '2009-07-30', 'M', 'Masculino', 'normal', 'Fernanda Souza', 'José Martins', 'Fernanda Souza', 'Mãe', 'Londrina', 'PR', 'Brasil', 1207),
(1110, '2013-01-25', 'M', 'Masculino', 'mutacao', 'Letícia Lima', 'Paulo Lima', 'Letícia Lima', 'Mãe', 'Florianópolis', 'SC', 'Brasil', 1208),
(1111, '2010-06-18', 'M', 'Masculino', 'pre_mutacao', 'Bruna Gomes', 'Lucas Gomes', 'Bruna Gomes', 'Mãe', 'Salvador', 'BA', 'Brasil', 1209),
(1112, '2017-10-14', 'M', 'Masculino', 'mutacao', 'Renata Carvalho', 'Thiago Carvalho', 'Renata Carvalho', 'Mãe', 'Recife', 'PE', 'Brasil', 1210),
(1113, '2007-09-02', 'F', 'Feminino', 'normal', 'Cíntia Rodrigues', 'Felipe Rodrigues', 'Cíntia Rodrigues', 'Mãe', 'Curitiba', 'PR', 'Brasil', 1202),
(1114, '2012-05-19', 'F', 'Feminino', 'mutacao', 'Daniela Alves', 'Gabriel Alves', 'Daniela Alves', 'Mãe', 'São Paulo', 'SP', 'Brasil', 1203),
(1115, '2014-08-08', 'F', 'Feminino', 'pre_mutacao', 'Evelyn Fernandes', 'Igor Fernandes', 'Evelyn Fernandes', 'Mãe', 'Belo Horizonte', 'MG', 'Brasil', 1205),
(1116, '2015-11-21', 'M', 'Masculino', 'mutacao', 'Fátima Rocha', 'Henrique Rocha', 'Fátima Rocha', 'Mãe', 'Porto Alegre', 'RS', 'Brasil', 1206),
(1117, '2009-04-03', 'M', 'Masculino', 'normal', 'Gabriela Barbosa', 'Leandro Barbosa', 'Gabriela Barbosa', 'Mãe', 'Rio de Janeiro', 'RJ', 'Brasil', 1204),
(1118, '2016-12-09', 'M', 'Masculino', 'mutacao', 'Helena Ribeiro', 'Mário Ribeiro', 'Helena Ribeiro', 'Mãe', 'Campinas', 'SP', 'Brasil', 1201),
(1119, '2011-02-14', 'M', 'Masculino', 'pre_mutacao', 'Isadora Mendes', 'Natan Mendes', 'Isadora Mendes', 'Mãe', 'Florianópolis', 'SC', 'Brasil', 1208),
(1120, '2018-07-27', 'M', 'Masculino', 'mutacao', 'Jéssica Pinto', 'Otávio Pinto', 'Jéssica Pinto', 'Mãe', 'Londrina', 'PR', 'Brasil', 1207)
ON CONFLICT (id_usuario) DO NOTHING;

-- Criar Historico Medico para os pacientes obrigatórios
INSERT INTO historico_medico (id_paciente, ja_fez_pcr, tipo_mutacao, tem_autismo) VALUES 
(1101, TRUE, 'Mutação Completa', TRUE),
(1102, FALSE, 'Desconhecido', FALSE),
(1103, TRUE, 'Mutação Completa', TRUE),
(1104, TRUE, 'Mutação Completa', FALSE)
ON CONFLICT DO NOTHING;

-- Vínculos Médicos (alguns vinculados ao Dr. Herai e Dr. Andrey)
INSERT INTO vinculos_medicos (id_medico, id_paciente, status) VALUES 
(1202, 1101, 'LINK_APPROVED'),
(1202, 1102, 'LINK_APPROVED'),
(1201, 1103, 'LINK_APPROVED'),
(1201, 1104, 'LINK_APPROVED'),
(1203, 1105, 'LINK_APPROVED'),
(1204, 1106, 'LINK_APPROVED'),
(1205, 1107, 'LINK_APPROVED')
ON CONFLICT DO NOTHING;

-- Reajustar sequência da tabela usuários se necessário
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

