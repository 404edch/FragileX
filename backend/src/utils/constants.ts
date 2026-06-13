export const USER_ROLES = {
  PACIENTE: "paciente",
  MEDICO: "medico",
} as const;

export const USER_STATUS = {
  PENDING_ACTIVATION: "PENDING_ACTIVATION",
  ACTIVE: "ACTIVE",
} as const;

export const BCRYPT_SALT_ROUNDS = 12;

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Erro interno no servidor.",
  INVALID_TOKEN: "Token de ativação inválido ou expirado.",
  CPF_EXISTS: "CPF_EXISTENTE",
  EMAIL_EXISTS: "EMAIL_EXISTENTE",
  REGISTERED_BY_DOCTOR: "REGISTRADO_PELO_MEDICO",
  CPF_ALREADY_REGISTERED: "CPF já cadastrado.",
  EMAIL_ALREADY_REGISTERED: "E-mail já cadastrado.",
  PATIENT_NOT_FOUND: "Perfil do paciente não encontrado.",
} as const;
