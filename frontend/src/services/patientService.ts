import { api } from "./api";
import { MockPaciente, MockUsuario, AutocadastroDTO, CadastrarPacienteDTO, MockFotoPaciente } from "./types";

export const patientService = {
  async getPaciente(idUsuario: number): Promise<MockPaciente | null> {
    try {
      return await api.get<MockPaciente>(`/patients/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async listarTodosPacientes(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente })[]>("/patients");
  },

  async cadastrarPacientePeloMedico(idMedico: number, dados: CadastrarPacienteDTO): Promise<{ linkAtivacao: string; token: string }> {
    return api.post<{ linkAtivacao: string; token: string }>("/patients/cadastrar-pelo-medico", { idMedico, ...dados });
  },

  async validarTokenAtivacao(token: string): Promise<MockUsuario | null> {
    try {
      return await api.get<MockUsuario>(`/patients/validar-token?token=${encodeURIComponent(token)}`);
    } catch {
      return null;
    }
  },

  async ativarConta(token: string, senha: string): Promise<boolean> {
    try {
      const res = await api.post<{ success: boolean }>("/patients/ativar-conta", { token, senha });
      return !!res.success;
    } catch {
      return false;
    }
  },

  async autocadastroPaciente(dados: AutocadastroDTO): Promise<MockUsuario> {
    return api.post<MockUsuario>("/patients/autocadastro", dados);
  },

  async checkCpf(cpf: string): Promise<{ exists: boolean; user?: MockUsuario }> {
    return api.get<{ exists: boolean; user?: MockUsuario }>(`/patients/check-cpf/${cpf}`);
  },

  async updatePatientStatus(id: number, status: string): Promise<void> {
    await api.put(`/patients/${id}/status`, { status });
  },

  async listarFotosPaciente(idPaciente: number): Promise<MockFotoPaciente[]> {
    return api.get<MockFotoPaciente[]>(`/pacientes/${idPaciente}/fotos`);
  },

  async adicionarFotoPaciente(idPaciente: number, fotoBase64: string): Promise<{ success: boolean; id_foto?: number }> {
    return api.post<{ success: boolean; id_foto?: number }>(`/pacientes/${idPaciente}/fotos`, { fotoBase64 });
  },

  async deletarFotoPaciente(idPaciente: number, idFoto: number): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/pacientes/${idPaciente}/fotos/${idFoto}`);
  },

  async atualizarFotoPerfil(idPaciente: number, fotoBase64: string): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }>(`/pacientes/${idPaciente}/foto-perfil`, { fotoBase64 });
  },

  async definirFotoPrincipal(idPaciente: number, idFoto: number): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }>(`/pacientes/${idPaciente}/fotos/${idFoto}/principal`, {});
  },
};
