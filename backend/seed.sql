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
