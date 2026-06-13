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

interface MockAudit {
  id: number;
  id_usuario?: number | null;
  nome_usuario: string;
  role: string;
  acao: string;
  detalhes: string;
  timestamp: string;
}

export interface MockConsulta {
  id: number;
  id_paciente: number;
  autor_id: number;
  autor_nome: string;
  role_autor: string;
  titulo: string;
  observacoes: string;
  data_consulta: string;
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

export interface MockFotoPaciente {
  id: number;
  url: string;
  is_principal: boolean;
  data_upload?: string;
}

// Payload for patient self-registration
export interface AutocadastroDTO extends Partial<Omit<MockUsuario, 'id' | 'role' | 'status'>>, Partial<Omit<MockPaciente, 'id_usuario'>> {
  // Allows flexibility for additional form fields without using 'any'
  [key: string]: unknown;
}

// Payload for doctor registering a patient
export interface CadastrarPacienteDTO extends Partial<Omit<MockUsuario, 'id' | 'role' | 'status'>>, Partial<Omit<MockPaciente, 'id_usuario'>> {
  // Allows flexibility for additional form fields without using 'any'
  [key: string]: unknown;
}
