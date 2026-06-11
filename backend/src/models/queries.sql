-- query teste (checklist preenchida)
SELECT 
    s.sintoma,
    cs.possui
FROM checklist_sintomas cs
JOIN sintomas s ON cs.id_sintoma = s.id
WHERE cs.id_checklist = 1;


-- pesquisa por nome do checklist com score 
-- or diminui a performance 
SELECT
	s.sintoma,
	cs.possui,
	CASE
	WHEN p.sexo_biologico = 'M' THEN s.score_m
	WHEN p.sexo_biologico = 'F' THEN s.score_f
	ELSE 0.0
	END AS score
FROM sintomas s
JOIN checklist_sintomas cs ON s.id = cs.id_sintoma
JOIN checklists c ON cs.id_checklist = c.id 
JOIN pacientes p ON c.id_paciente = p.id_usuario
JOIN usuarios u ON p.id_usuario = u.id
WHERE u.nome = 'Paciente 11' OR u.cpf = '33333333311'; -- substituir por variavel do back no nome e no cpf

-- informações para os cards dos 10 ultimos consultados
-- nome sexo e data
SELECT 
	u.nome,
	p.sexo_biologico,
	c.data_preenchimento::DATE
FROM checklists c 
JOIN pacientes p ON c.id_paciente = p.id_usuario
JOIN usuarios u ON p.id_usuario = u.id
ORDER BY c.data_preenchimento DESC LIMIT 10;

-- score final e quem preencheu
SELECT
	c.score_final,
	c.preenchido_por 
FROM checklists c 
JOIN usuarios u ON c.id_paciente = u.id
WHERE u.nome = 'Paciente 11' OR u.cpf = '33333333311'; -- substituir por :variaveldoback no nome e no cpf 

