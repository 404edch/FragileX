const fs = require('fs');
let content = fs.readFileSync('frontend/src/services/backendService.ts', 'utf8');

const newMethod = `
  async atualizarFotoPerfil(idPaciente: number, fotoBase64: string): Promise<any> {
    const res = await api.put(\`/pacientes/\${idPaciente}/foto-perfil\`, { fotoBase64 });
    return res.data;
  },
`;

content = content.replace('async definirFotoPrincipal', newMethod + '\n  async definirFotoPrincipal');
fs.writeFileSync('frontend/src/services/backendService.ts', content);
