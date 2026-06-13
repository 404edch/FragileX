export interface Patient {
  id: number | string;
  name: string;
  age: number;
  sex: string;
  lastConsultation: string;
  tag?: string;
  responsibleFigure?: string;
  phone?: string;
  foto_perfil?: string | null;
  classificacao_oficial?: string;
  encaminhamento_status?: string;
}

export interface MedicoDetails {
  crm?: string;
  especialidade?: string;
  instituicao?: string;
  cidade?: string;
  estado?: string;
}

export interface PacienteDetails {
  cidade?: string;
  estado?: string;
  responsavel_nome?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  status: "PENDING_ACTIVATION" | "ACTIVE";
  role: "paciente" | "medico" | "instituto" | "admin";
  medicoDetails?: MedicoDetails;
  pacienteDetails?: PacienteDetails;
}
