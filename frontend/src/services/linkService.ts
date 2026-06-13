import { api } from './api';
import { MockVinculo } from './types';

export const linkService = {
  async importarPacientePorCpf(idMedico: number, cpf: string): Promise<MockVinculo> {
    return api.post<MockVinculo>('/links/solicitar', { idMedico, cpf });
  },

  async listarSolicitacoesVinculoPaciente(idPaciente: number): Promise<MockVinculo[]> {
    return api.get<MockVinculo[]>(`/links/paciente/${idPaciente}`);
  },

  async responderSolicitacaoVinculo(idVinculo: number, aceitar: boolean): Promise<void> {
    await api.post(`/links/${idVinculo}/responder`, { aceitar });
  }
};
