import { api } from './api';
import { MockAudit } from './types';

export const auditService = {
  async logAction(idUsuario: number | null, nomeUsuario: string, role: string, acao: string, detalhes: string): Promise<void> {
    await api.post('/audits', { idUsuario, nomeUsuario, role, acao, detalhes });
  },

  async getAudits(): Promise<MockAudit[]> {
    return api.get<MockAudit[]>('/audits');
  }
};
