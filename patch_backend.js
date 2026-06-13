const fs = require('fs');
let content = fs.readFileSync('frontend/src/services/backendService.ts', 'utf8');

const newMethods = `
  async listarFotosPaciente(idPaciente: number): Promise<any[]> {
    const res = await api.get(\`/pacientes/\${idPaciente}/fotos\`);
    return res.data;
  },
  async adicionarFotoPaciente(idPaciente: number, fotoBase64: string): Promise<any> {
    const res = await api.post(\`/pacientes/\${idPaciente}/fotos\`, { fotoBase64 });
    return res.data;
  },
  async deletarFotoPaciente(idPaciente: number, idFoto: number): Promise<any> {
    const res = await api.delete(\`/pacientes/\${idPaciente}/fotos/\${idFoto}\`);
    return res.data;
  },
  async definirFotoPrincipal(idPaciente: number, idFoto: number): Promise<any> {
    const res = await api.put(\`/pacientes/\${idPaciente}/fotos/\${idFoto}/principal\`);
    return res.data;
  },
`;

content = content.replace('deletarNota(idNota: number): Promise<any> {', newMethods + '\n  deletarNota(idNota: number): Promise<any> {');

fs.writeFileSync('frontend/src/services/backendService.ts', content);
