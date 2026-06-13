import { api } from './api';
import { MockChecklist } from './types';

export const checklistService = {
  async salvarChecklistPaciente(idPaciente: number, idMedico: number | null, preenchidoPor: string, sintomasSelecionados: number[], scoreFinal: number): Promise<MockChecklist> {
    return api.post<MockChecklist>('/checklists', { idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal });
  },

  async obterChecklistsPaciente(idPaciente: number): Promise<MockChecklist[]> {
    return api.get<MockChecklist[]>(`/checklists/paciente/${idPaciente}`);
  }
};
