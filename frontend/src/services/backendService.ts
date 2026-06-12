import { api } from './api';

export interface MockUsuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  senha_hash: string;
  role: 'medico' | 'instituto' | 'paciente' | 'admin';
  status: 'PENDING_ACTIVATION' | 'ACTIVE';
  token_ativacao?: string;
  data_criacao: string;
}

export interface MockMedico {
  id_usuario: number;
  crm: string;
  especialidade: string;
  cidade?: string;
  estado?: string;
  instituicao?: string;
}

export interface MockPaciente {
  id_usuario: number;
  data_nascimento: string;
  sexo_biologico: 'M' | 'F';
  genero: string;
  sindrome: 'normal' | 'mutacao' | 'pre_mutacao';
  nome_mae: string;
  nome_pai?: string;
  responsavel_nome: string;
  responsavel_parentesco: string;
  responsavel_cpf: string;
  cidade: string;
  estado: string;
  pais: string;
  telefone_2?: string;
  whatsapp?: string;
  id_medico_responsavel?: number | null;
  foto_perfil?: string | null;
  classificacao_oficial?: string;
  encaminhamento_status?: 'pendente' | 'encaminhado' | 'encaminhamento negado';
}

export interface MockVinculo {
  id: number;
  id_medico: number;
  nome_medico: string;
  id_paciente: number;
  status: 'PENDING_LINK' | 'LINK_APPROVED' | 'LINK_DENIED';
  data_solicitacao: string;
}

export interface MockSolicitacaoCredenciamento {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
  instituicao: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  motivo_recusa?: string;
  data_criacao: string;
}

export interface MockChecklist {
  id: number;
  id_paciente: number;
  id_medico?: number | null;
  preenchido_por: string;
  score_final: number;
  sintomas_selecionados: number[];
  data_preenchimento: string;
}

export interface MockAudit {
  id: number;
  id_usuario?: number | null;
  nome_usuario: string;
  role: string;
  acao: string;
  detalhes: string;
  timestamp: string;
}

export interface MockNews {
  id: number;
  titulo: string;
  imagemUrl: string;
  linkHref: string;
}

export interface LandingCard {
  id: number;
  nome: string;
  etiquetaImg: string;
  imagemUrl?: string;
  linkHref?: string;
}

export const backendService = {
  async logAction(idUsuario: number | null, nomeUsuario: string, role: string, acao: string, detalhes: string): Promise<void> {
    await api.post('/audits', { idUsuario, nomeUsuario, role, acao, detalhes });
  },

  async getAudits(): Promise<MockAudit[]> {
    return api.get<MockAudit[]>('/audits');
  },

  async login(emailOrCpf: string, senha: string): Promise<MockUsuario | null> {
    try {
      const response = await api.post<{ message: string; token: string; user: MockUsuario }>('/auth/login', { emailOrCpf, senha });
      return response.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getUsuario(id: number): Promise<MockUsuario | null> {
    try {
      return await api.get<MockUsuario>(`/users/${id}`);
    } catch {
      return null;
    }
  },

  async getPaciente(idUsuario: number): Promise<MockPaciente | null> {
    try {
      return await api.get<MockPaciente>(`/patients/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async getMedico(idUsuario: number): Promise<MockMedico | null> {
    try {
      return await api.get<MockMedico>(`/doctors/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async listarTodosPacientes(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente })[]>('/patients');
  },

  async listarTodosUsuarios(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[]>('/users');
  },

  async atualizarUsuario(id: number, dados: any, adminUser: { id: number; nome: string; role: string }): Promise<void> {
    await api.put(`/users/${id}`, { ...dados, adminUser });
  },

  async deletarUsuario(id: number, adminUser: { id: number; nome: string; role: string }): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async registrarMedicoDireto(dados: any, adminUser: { id: number; nome: string; role: string }): Promise<MockUsuario> {
    return api.post<MockUsuario>('/doctors/registrar-direto', { ...dados, adminUser });
  },

  async listarPacientesDoMedico(idMedico: number): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente })[]>(`/patients/medico/${idMedico}`);
  },

  async cadastrarPacientePeloMedico(idMedico: number, dados: any): Promise<{ linkAtivacao: string; token: string }> {
    return api.post<{ linkAtivacao: string; token: string }>('/patients/cadastrar-pelo-medico', { idMedico, ...dados });
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
      const res = await api.post<{ success: boolean }>('/patients/ativar-conta', { token, senha });
      return !!res.success;
    } catch {
      return false;
    }
  },

  async autocadastroPaciente(dados: any): Promise<MockUsuario> {
    return api.post<MockUsuario>('/patients/autocadastro', dados);
  },

  async importarPacientePorCpf(idMedico: number, cpf: string): Promise<MockVinculo> {
    return api.post<MockVinculo>('/links/solicitar', { idMedico, cpf });
  },

  async listarSolicitacoesVinculoPaciente(idPaciente: number): Promise<MockVinculo[]> {
    return api.get<MockVinculo[]>(`/links/paciente/${idPaciente}`);
  },

  async responderSolicitacaoVinculo(idVinculo: number, aceitar: boolean): Promise<void> {
    await api.post(`/links/${idVinculo}/responder`, { aceitar });
  },

  async solicitarCredenciamentoMedico(dados: any): Promise<MockSolicitacaoCredenciamento> {
    return api.post<MockSolicitacaoCredenciamento>('/doctors/solicitar', dados);
  },

  async listarSolicitacoesCredenciamento(): Promise<MockSolicitacaoCredenciamento[]> {
    return api.get<MockSolicitacaoCredenciamento[]>('/doctors/solicitacoes');
  },

  async responderSolicitacaoCredenciamento(idSolicitacao: number, aprovar: boolean, motivoRecusa?: string): Promise<{ linkAtivacao?: string }> {
    return api.post<{ linkAtivacao?: string }>(`/doctors/solicitacoes/${idSolicitacao}/responder`, { aprovar, motivoRecusa });
  },

  async salvarChecklistPaciente(idPaciente: number, idMedico: number | null, preenchidoPor: string, sintomasSelecionados: number[], scoreFinal: number): Promise<MockChecklist> {
    return api.post<MockChecklist>('/checklists', { idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal });
  },

  async obterChecklistsPaciente(idPaciente: number): Promise<MockChecklist[]> {
    return api.get<MockChecklist[]>(`/checklists/paciente/${idPaciente}`);
  },

  async getLandingCards(): Promise<LandingCard[]> {
    return api.get<LandingCard[]>('/landing/cards');
  },

  async saveLandingCards(cards: LandingCard[]): Promise<void> {
    await api.post('/landing/cards', cards);
  },

  async getLandingNews(): Promise<MockNews[]> {
    return api.get<MockNews[]>('/landing/news');
  },

  async saveLandingNews(news: MockNews[]): Promise<void> {
    await api.post('/landing/news', news);
  },

  async checkCpf(cpf: string): Promise<{ exists: boolean, user?: MockUsuario }> {
    return api.get<{ exists: boolean, user?: MockUsuario }>(`/patients/check-cpf/${cpf}`);
  },

  async updatePatientStatus(id: number, status: string): Promise<void> {
    await api.put(`/patients/${id}/status`, { status });
  }
};
