-- query teste (checklist preenchida)
SELECT 
    s.sintoma,
    cs.possui
FROM checklist_sintomas cs
JOIN sintomas s ON cs.id_sintoma = s.id
WHERE cs.id_checklist = 1;

