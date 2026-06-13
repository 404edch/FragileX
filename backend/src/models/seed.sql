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
