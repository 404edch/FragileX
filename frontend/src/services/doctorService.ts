import { api } from "./api";
import { MockMedico, MockUsuario, MockPaciente, MockSolicitacaoCredenciamento } from "./types";
import { Usuario } from "../contexts/AuthContext";

export const doctorService = {
  async getMedico(idUsuario: number): Promise<MockMedico | null> {
    try {
      return await api.get<MockMedico>(`/doctors/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async registrarMedicoDireto(dados: object): Promise<MockUsuario> {
    return api.post<MockUsuario>("/doctors/registrar-direto", dados);
  },

  async listarPacientesDoMedico(idMedico: number): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente })[]>(`/patients/medico/${idMedico}`);
  },

  async solicitarCredenciamentoMedico(dados: object): Promise<MockSolicitacaoCredenciamento> {
    return api.post<MockSolicitacaoCredenciamento>("/doctors/solicitar", dados);
  },

  async listarSolicitacoesCredenciamento(): Promise<MockSolicitacaoCredenciamento[]> {
    return api.get<MockSolicitacaoCredenciamento[]>("/doctors/solicitacoes");
  },

  async responderSolicitacaoCredenciamento(idSolicitacao: number, aprovar: boolean, motivoRecusa?: string): Promise<{ linkAtivacao?: string }> {
    return api.post<{ linkAtivacao?: string }>(`/doctors/solicitacoes/${idSolicitacao}/responder`, { aprovar, motivoRecusa });
  },
};
