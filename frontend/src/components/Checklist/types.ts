export interface PatientDetails {
  id: number;
  nome: string;
  cpf: string;
  pacienteDetails?: {
    sexo_biologico: string;
  };
}

export interface ReportData {
  score_final: number;
  classificacao: string;
  memoria_calculo: string;
  sintomas_identificados: (string | undefined)[];
  isRapido: boolean;
}

