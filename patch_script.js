const fs = require('fs');
let content = fs.readFileSync('backend/src/controllers/patientController.ts', 'utf-8');

// Replace the SQL query in listPacientesDoMedico
content = content.replace(
  `SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente' AND (`,
  `SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente' AND (`
);

// Replace the mapped object in listPacientesDoMedico
content = content.replace(
  `whatsapp: row.whatsapp,
        id_medico_responsavel: row.id_medico_responsavel
      }
    }));`,
  `whatsapp: row.whatsapp,
        id_medico_responsavel: row.id_medico_responsavel,
        foto_perfil: row.foto_perfil,
        encaminhamento_status: row.encaminhamento_status,
        classificacao_oficial: row.classificacao_oficial
      }
    }));`
);

// Replace the SQL query in listTodosPacientes
content = content.replace(
  `SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente'
      ORDER BY u.nome ASC`,
  `SELECT u.id, u.nome, u.cpf, u.email, u.telefone, u.status, u.role,
             p.data_nascimento, p.sexo_biologico, p.genero, p.sindrome, p.responsavel_nome, p.cidade, p.estado, p.pais, p.whatsapp, p.id_medico_responsavel, p.foto_perfil, p.encaminhamento_status, p.classificacao_oficial
      FROM usuarios u
      JOIN pacientes p ON u.id = p.id_usuario
      WHERE u.role = 'paciente'
      ORDER BY u.nome ASC`
);

// Replace the mapped object in listTodosPacientes
content = content.replace(
  `whatsapp: row.whatsapp,
        id_medico_responsavel: row.id_medico_responsavel
      }
    }));`,
  `whatsapp: row.whatsapp,
        id_medico_responsavel: row.id_medico_responsavel,
        foto_perfil: row.foto_perfil,
        encaminhamento_status: row.encaminhamento_status,
        classificacao_oficial: row.classificacao_oficial
      }
    }));`
);

fs.writeFileSync('backend/src/controllers/patientController.ts', content, 'utf-8');
console.log('Patched');
