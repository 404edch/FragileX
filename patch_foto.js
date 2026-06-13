const fs = require('fs');
let content = fs.readFileSync('backend/src/controllers/patientController.ts', 'utf8');

const newMethod = `
export const atualizarFotoPerfil = async (req: Request, res: Response): Promise<any> => {
  const idPaciente = Number(req.params.id);
  const { fotoBase64 } = req.body;
  if (isNaN(idPaciente) || !fotoBase64) return res.status(400).json({ error: "Dados inválidos" });
  
  try {
    await db.query("UPDATE pacientes SET foto_perfil = $1 WHERE id_usuario = $2", [fotoBase64, idPaciente]);
    return res.json({ success: true, foto_url: fotoBase64 });
  } catch (err) {
    console.error("Erro ao atualizar foto", err);
    return res.status(500).json({ error: "Erro interno" });
  }
};
`;

content = content + '\n' + newMethod;
fs.writeFileSync('backend/src/controllers/patientController.ts', content);

let apiContent = fs.readFileSync('backend/src/routes/apiRotas.ts', 'utf8');
apiContent = apiContent.replace('// ── Consultas (Anotações) ──', 'router.put("/pacientes/:id/foto-perfil", requireRole(["instituto", "admin", "paciente", "medico"]), patientController.atualizarFotoPerfil);\n\n// ── Consultas (Anotações) ──');
fs.writeFileSync('backend/src/routes/apiRotas.ts', apiContent);
