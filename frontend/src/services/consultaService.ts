import { api } from './api';
import { MockConsulta } from './types';

export const consultaService = {
  async adicionarNota(idPaciente: number, observacoes: string, idAutor: number, nomeAutor: string, roleAutor: string): Promise<MockConsulta> {
    return api.post<MockConsulta>(`/consultas/${idPaciente}`, { observacoes, idAutor, nomeAutor, roleAutor });
  },

  async listarNotasPaciente(idPaciente: number): Promise<MockConsulta[]> {
    return api.get<MockConsulta[]>(`/consultas/paciente/${idPaciente}`);
  },

  async atualizarNota(idNota: number, observacoes: string): Promise<MockConsulta> {
    return api.put<MockConsulta>(`/consultas/${idNota}`, { observacoes });
  },

  async deletarNota(idNota: number): Promise<void> {
    await api.delete(`/consultas/${idNota}`);
  }
};
