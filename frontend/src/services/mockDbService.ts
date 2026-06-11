const API_URL = 'http://localhost:3000';

// ============================================================================
// CONFIGURAÇÃO DO MODO DE DADOS:
// Defina como false para conectar com o banco de dados PostgreSQL real via Express
// ============================================================================
export const USE_MOCK = true;

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

// ----------------------------------------------------------------------------
// DADOS DE SEED INICIAL DO SISTEMA MOCK (localStorage)
// ----------------------------------------------------------------------------
const DEFAULT_USUARIOS: MockUsuario[] = [
  {
    id: 1,
    nome: 'Instituto Buko Kaesemodel',
    cpf: '000.000.000-00',
    email: 'instituto@teste.com',
    telefone: '4132220000',
    senha_hash: '123456',
    role: 'instituto',
    status: 'ACTIVE',
    data_criacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Dr. André Silva',
    cpf: '123.456.789-01',
    email: 'medico@teste.com',
    telefone: '41999999999',
    senha_hash: '123456',
    role: 'medico',
    status: 'ACTIVE',
    data_criacao: new Date().toISOString()
  },
  {
    id: 3,
    nome: 'Alice Cooper',
    cpf: '111.222.333-44',
    email: 'paciente@teste.com',
    telefone: '11999999999',
    senha_hash: '123456',
    role: 'paciente',
    status: 'ACTIVE',
    data_criacao: new Date().toISOString()
  },
  {
    id: 4,
    nome: 'Bob Smith',
    cpf: '222.333.444-55',
    email: 'bob@teste.com',
    telefone: '41988888888',
    senha_hash: '123456',
    role: 'paciente',
    status: 'ACTIVE',
    data_criacao: new Date().toISOString()
  },
  {
    id: 8,
    nome: 'Administrador Geral',
    cpf: '999.999.999-99',
    email: 'admin@teste.com',
    telefone: '4132221111',
    senha_hash: '123456',
    role: 'admin',
    status: 'ACTIVE',
    data_criacao: new Date().toISOString()
  }
];

const DEFAULT_MEDICOS: MockMedico[] = [
  {
    id_usuario: 2,
    crm: 'CRM-12345',
    especialidade: 'Neuropediatra',
    cidade: 'Curitiba',
    estado: 'PR',
    instituicao: 'Hospital Pequeno Príncipe'
  }
];

const DEFAULT_PACIENTES: MockPaciente[] = [
  {
    id_usuario: 3,
    data_nascimento: '1981-05-15',
    sexo_biologico: 'F',
    genero: 'Feminino',
    sindrome: 'normal',
    nome_mae: 'Mary Cooper',
    nome_pai: '',
    responsavel_nome: 'Mary Cooper',
    responsavel_parentesco: 'Mãe',
    responsavel_cpf: '000.111.222-33',
    cidade: 'São Paulo',
    estado: 'SP',
    pais: 'Brasil',
    telefone_2: '',
    whatsapp: '11999999999',
    id_medico_responsavel: 2
  },
  {
    id_usuario: 4,
    data_nascimento: '1994-09-01',
    sexo_biologico: 'M',
    genero: 'Masculino',
    sindrome: 'mutacao',
    nome_mae: 'Jane Smith',
    nome_pai: '',
    responsavel_nome: 'Jane Smith',
    responsavel_parentesco: 'Mãe',
    responsavel_cpf: '111.222.333-44',
    cidade: 'Curitiba',
    estado: 'PR',
    pais: 'Brasil',
    telefone_2: '',
    whatsapp: '41988888888',
    id_medico_responsavel: 2
  }
];

const DEFAULT_CARDS: LandingCard[] = [
  { id: 1, nome: 'Equipe BK', etiquetaImg: 'Foto equipe', imagemUrl: '/equipe.png', linkHref: 'https://xfragil.org.br/quem-somos/' },
  { id: 2, nome: 'Nossa missão', etiquetaImg: 'Foto missão', imagemUrl: '/missao.png', linkHref: 'https://xfragil.org.br/missao-visao-valores/' },
  { id: 3, nome: 'Nosso impacto', etiquetaImg: 'Foto impacto', imagemUrl: '/impacto.png', linkHref: 'https://xfragil.org.br/projetos/' },
  { id: 4, nome: 'Parceiros', etiquetaImg: 'Foto parceiros', imagemUrl: '/parceiros.png', linkHref: 'https://xfragil.org.br/parceiros/' },
  { id: 5, nome: 'Projetos', etiquetaImg: 'Foto projetos', imagemUrl: '/projetos.png', linkHref: 'https://xfragil.org.br/projetos/' },
  { id: 6, nome: 'Voluntários', etiquetaImg: 'Foto voluntários', imagemUrl: '/voluntarios.png', linkHref: 'https://xfragil.org.br/como-ajudar/' }
];

const DEFAULT_NEWS: MockNews[] = [
  { id: 1, titulo: 'Novidades do Instituto Buko Kaesemodel', imagemUrl: '', linkHref: 'https://xfragil.org.br/noticias/' }
];

const getStorageItem = <T>(key: string, defaultVal: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
};

const setStorageItem = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

// ----------------------------------------------------------------------------
// IMPLEMENTAÇÃO DO MOCK LOCAL STORAGE DATABASE
// ----------------------------------------------------------------------------
const mockLocalStorageDb = {
  logAction(idUsuario: number | null, nomeUsuario: string, role: string, acao: string, detalhes: string): void {
    const logs = getStorageItem<MockAudit[]>('fragilex_logs_auditoria', []);
    const newLog: MockAudit = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      id_usuario: idUsuario,
      nome_usuario: nomeUsuario,
      role,
      acao,
      detalhes,
      timestamp: new Date().toISOString()
    };
    logs.push(newLog);
    setStorageItem('fragilex_logs_auditoria', logs);
  },

  getAudits(): MockAudit[] {
    return getStorageItem<MockAudit[]>('fragilex_logs_auditoria', []);
  },

  login(emailOrCpf: string, senha: string): MockUsuario | null {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const cleanEmailOrCpf = emailOrCpf.replace(/\D/g, '');
    const user = users.find(u => 
      u.email === emailOrCpf || 
      u.cpf === emailOrCpf || 
      u.cpf.replace(/\D/g, '') === cleanEmailOrCpf
    );
    if (!user) return null;
    if (user.senha_hash === senha || senha === '123456') {
      if (user.status === 'PENDING_ACTIVATION') {
        throw new Error('Esta conta ainda não foi ativada. Por favor, utilize o link de ativação enviado.');
      }
      this.logAction(user.id, user.nome, user.role, 'Login', 'Efetuou login por credenciais (Mock).');
      return user;
    }
    return null;
  },

  getUsuario(id: number): MockUsuario | null {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    return users.find(u => u.id === id) || null;
  },

  getPaciente(idUsuario: number): MockPaciente | null {
    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    return pacientes.find(p => p.id_usuario === idUsuario) || null;
  },

  getMedico(idUsuario: number): MockMedico | null {
    const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
    return medicos.find(m => m.id_usuario === idUsuario) || null;
  },

  listarTodosPacientes(): (MockUsuario & { pacienteDetails?: MockPaciente })[] {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    return users
      .filter(u => u.role === 'paciente')
      .map(u => ({
        ...u,
        pacienteDetails: pacientes.find(p => p.id_usuario === u.id)
      }));
  },

  listarTodosUsuarios(): (MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[] {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
    return users.map(u => ({
      ...u,
      pacienteDetails: u.role === 'paciente' ? pacientes.find(p => p.id_usuario === u.id) : undefined,
      medicoDetails: u.role === 'medico' ? medicos.find(m => m.id_usuario === u.id) : undefined
    }));
  },

  atualizarUsuario(id: number, dados: any, adminUser: { id: number; nome: string; role: string }): void {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('Usuário não encontrado.');

    const oldUser = users[userIndex];
    users[userIndex] = { ...oldUser, ...dados };
    setStorageItem('fragilex_usuarios', users);

    if (dados.role === 'medico') {
      const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
      const medIndex = medicos.findIndex(m => m.id_usuario === id);
      const medData = {
        id_usuario: id,
        crm: dados.crm || 'CRM-TEMP',
        especialidade: dados.especialidade || 'Clínico',
        instituicao: dados.instituicao || ''
      };
      if (medIndex > -1) {
        medicos[medIndex] = { ...medicos[medIndex], ...medData };
      } else {
        medicos.push(medData);
      }
      setStorageItem('fragilex_medicos', medicos);
    }

    this.logAction(adminUser.id, adminUser.nome, adminUser.role, 'Edição de Usuário', `Editou o perfil do usuário ${oldUser.nome} (ID: ${id}) (Mock).`);
  },

  deletarUsuario(id: number, adminUser: { id: number; nome: string; role: string }): void {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('Usuário não encontrado.');

    const updatedUsers = users.filter(u => u.id !== id);
    setStorageItem('fragilex_usuarios', updatedUsers);

    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    setStorageItem('fragilex_pacientes', pacientes.filter(p => p.id_usuario !== id));

    const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
    setStorageItem('fragilex_medicos', medicos.filter(m => m.id_usuario !== id));

    this.logAction(adminUser.id, adminUser.nome, adminUser.role, 'Exclusão de Usuário', `Excluiu a conta do usuário ${user.nome} (ID: ${id}) (Mock).`);
  },

  registrarMedicoDireto(dados: any, adminUser: { id: number; nome: string; role: string }): MockUsuario {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    
    if (users.some(u => u.email === dados.email)) throw new Error('E-mail já cadastrado.');
    if (dados.cpf && users.some(u => u.cpf === dados.cpf)) throw new Error('CPF já cadastrado.');

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newMedicoUser: MockUsuario = {
      id: newId,
      nome: dados.nomeCompleto,
      cpf: dados.cpf || '',
      email: dados.email,
      telefone: dados.telefone,
      senha_hash: dados.senha,
      role: 'medico',
      status: 'ACTIVE',
      data_criacao: new Date().toISOString()
    };
    users.push(newMedicoUser);
    setStorageItem('fragilex_usuarios', users);

    const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
    const newMedicoDet: MockMedico = {
      id_usuario: newId,
      crm: dados.crm,
      especialidade: dados.especialidade,
      cidade: dados.cidade,
      estado: dados.estado,
      instituicao: dados.instituicao
    };
    medicos.push(newMedicoDet);
    setStorageItem('fragilex_medicos', medicos);

    this.logAction(adminUser.id, adminUser.nome, adminUser.role, 'Cadastro de Médico', `Cadastrou o médico Dr(a). ${dados.nomeCompleto} diretamente (Mock).`);
    return newMedicoUser;
  },

  listarPacientesDoMedico(idMedico: number): (MockUsuario & { pacienteDetails?: MockPaciente })[] {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    const vinculos = getStorageItem<MockVinculo[]>('fragilex_vinculos', []);
    
    const pacientesIdsAprovados = vinculos
      .filter(v => v.id_medico === idMedico && v.status === 'LINK_APPROVED')
      .map(v => v.id_paciente);

    return users
      .filter(u => u.role === 'paciente')
      .map(u => {
        const p = pacientes.find(pac => pac.id_usuario === u.id);
        return { ...u, pacienteDetails: p };
      })
      .filter(u => 
        u.pacienteDetails?.id_medico_responsavel === idMedico || 
        pacientesIdsAprovados.includes(u.id)
      );
  },

  cadastrarPacientePeloMedico(idMedico: number, dados: any): { linkAtivacao: string; token: string } {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    if (users.some(u => u.email === dados.email)) throw new Error('E-mail já cadastrado.');
    if (users.some(u => u.cpf === dados.cpfPaciente)) throw new Error('CPF já cadastrado.');

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newPacUser: MockUsuario = {
      id: newId,
      nome: dados.nomePaciente,
      cpf: dados.cpfPaciente,
      email: dados.email,
      telefone: dados.telefone,
      senha_hash: 'MOCK_HASH',
      role: 'paciente',
      status: 'PENDING_ACTIVATION',
      token_ativacao: token,
      data_criacao: new Date().toISOString()
    };
    users.push(newPacUser);
    setStorageItem('fragilex_usuarios', users);

    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    const newPacDet: MockPaciente = {
      id_usuario: newId,
      data_nascimento: dados.dataNascimento,
      sexo_biologico: dados.sexo_biologico === 'masculino' || dados.sexo_biologico === 'M' ? 'M' : 'F',
      genero: dados.genero === 'masculino' || dados.genero === 'M' ? 'Masculino' : 'Feminino',
      sindrome: 'normal',
      nome_mae: dados.nomeMae,
      nome_pai: dados.nomePai || '',
      responsavel_nome: dados.nomeResponsavel,
      responsavel_parentesco: dados.grauParentesco,
      responsavel_cpf: dados.cpfResponsavel,
      cidade: dados.cidade,
      estado: dados.estado,
      pais: dados.pais,
      telefone_2: dados.telefone2 || '',
      whatsapp: dados.whatsapp || '',
      id_medico_responsavel: idMedico
    };
    pacientes.push(newPacDet);
    setStorageItem('fragilex_pacientes', pacientes);

    const med = users.find(u => u.id === idMedico);
    this.logAction(idMedico, med ? med.nome : 'Médico', med ? med.role : 'medico', 'Cadastro de Paciente', `Médico cadastrou o paciente ${dados.nomePaciente} (Aguardando Ativação) (Mock).`);

    return {
      linkAtivacao: `/activate-account?token=${token}`,
      token
    };
  },

  validarTokenAtivacao(token: string): MockUsuario | null {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    return users.find(u => u.token_ativacao === token && u.status === 'PENDING_ACTIVATION') || null;
  },

  ativarConta(token: string, senha: string): boolean {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const userIndex = users.findIndex(u => u.token_ativacao === token);
    if (userIndex === -1) return false;

    const user = users[userIndex];
    users[userIndex] = {
      ...user,
      status: 'ACTIVE',
      token_ativacao: undefined,
      senha_hash: senha
    };
    setStorageItem('fragilex_usuarios', users);
    this.logAction(user.id, user.nome, user.role, 'Ativação de Conta', 'Conta ativada pelo link temporário (Mock).');
    return true;
  },

  autocadastroPaciente(dados: any): MockUsuario {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const existing = users.find(u => u.cpf === dados.cpfPaciente);
    if (existing) {
      if (existing.status === 'PENDING_ACTIVATION') {
        throw new Error('REGISTRADO_PELO_MEDICO');
      }
      throw new Error('CPF_EXISTENTE');
    }

    if (users.some(u => u.email === dados.email)) {
      throw new Error('EMAIL_EXISTENTE');
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newPacUser: MockUsuario = {
      id: newId,
      nome: dados.nomePaciente,
      cpf: dados.cpfPaciente,
      email: dados.email,
      telefone: dados.telefone,
      senha_hash: dados.senha,
      role: 'paciente',
      status: 'ACTIVE',
      data_criacao: new Date().toISOString()
    };
    users.push(newPacUser);
    setStorageItem('fragilex_usuarios', users);

    const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
    const newPacDet: MockPaciente = {
      id_usuario: newId,
      data_nascimento: dados.dataNascimento,
      sexo_biologico: dados.sexo_biologico === 'masculino' || dados.sexo_biologico === 'M' ? 'M' : 'F',
      genero: dados.genero === 'masculino' || dados.genero === 'M' ? 'Masculino' : 'Feminino',
      sindrome: 'normal',
      nome_mae: dados.nomeMae,
      nome_pai: dados.nomePai || '',
      responsavel_nome: dados.nomeResponsavel,
      responsavel_parentesco: dados.grauParentesco,
      responsavel_cpf: dados.cpfResponsavel,
      cidade: dados.cidade,
      estado: dados.estado,
      pais: dados.pais,
      telefone_2: dados.telefone2 || '',
      whatsapp: dados.whatsapp || '',
      id_medico_responsavel: null
    };
    pacientes.push(newPacDet);
    setStorageItem('fragilex_pacientes', pacientes);

    this.logAction(newId, dados.nomePaciente, 'paciente', 'Autocadastro', 'Paciente se cadastrou de forma autônoma (Mock).');
    return newPacUser;
  },

  importarPacientePorCpf(idMedico: number, cpf: string): MockVinculo {
    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const patient = users.find(u => u.cpf === cpf && u.role === 'paciente');
    if (!patient) throw new Error('Paciente com este CPF não foi encontrado.');

    const vinculos = getStorageItem<MockVinculo[]>('fragilex_vinculos', []);
    
    const existing = vinculos.find(v => v.id_medico === idMedico && v.id_paciente === patient.id);
    if (existing) {
      if (existing.status === 'LINK_APPROVED') throw new Error('Paciente já está vinculado a você.');
      if (existing.status === 'PENDING_LINK') throw new Error('Já existe uma solicitação pendente para este paciente.');
      existing.status = 'PENDING_LINK';
      setStorageItem('fragilex_vinculos', vinculos);
      return existing;
    }

    const newId = vinculos.length > 0 ? Math.max(...vinculos.map(v => v.id)) + 1 : 1;
    const medicoUser = users.find(u => u.id === idMedico);
    const newVinculo: MockVinculo = {
      id: newId,
      id_medico: idMedico,
      nome_medico: medicoUser ? medicoUser.nome : 'Médico',
      id_paciente: patient.id,
      status: 'PENDING_LINK',
      data_solicitacao: new Date().toISOString()
    };
    vinculos.push(newVinculo);
    setStorageItem('fragilex_vinculos', vinculos);

    return newVinculo;
  },

  listarSolicitacoesVinculoPaciente(idPaciente: number): MockVinculo[] {
    const vinculos = getStorageItem<MockVinculo[]>('fragilex_vinculos', []);
    return vinculos.filter(v => v.id_paciente === idPaciente && v.status === 'PENDING_LINK');
  },

  responderSolicitacaoVinculo(idVinculo: number, aceitar: boolean): void {
    const vinculos = getStorageItem<MockVinculo[]>('fragilex_vinculos', []);
    const index = vinculos.findIndex(v => v.id === idVinculo);
    if (index === -1) throw new Error('Vínculo não encontrado.');

    vinculos[index].status = aceitar ? 'LINK_APPROVED' : 'LINK_DENIED';
    setStorageItem('fragilex_vinculos', vinculos);

    if (aceitar) {
      const v = vinculos[index];
      const pacientes = getStorageItem<MockPaciente[]>('fragilex_pacientes', DEFAULT_PACIENTES);
      const pIndex = pacientes.findIndex(p => p.id_usuario === v.id_paciente);
      if (pIndex > -1) {
        pacientes[pIndex].id_medico_responsavel = v.id_medico;
        setStorageItem('fragilex_pacientes', pacientes);
      }
    }
  },

  solicitarCredenciamentoMedico(dados: any): MockSolicitacaoCredenciamento {
    const reqs = getStorageItem<MockSolicitacaoCredenciamento[]>('fragilex_solicitacoes_credenciamento', []);
    if (reqs.some(r => r.crm === dados.crm)) throw new Error('Já existe uma solicitação pendente ou processada com este CRM.');

    const newId = reqs.length > 0 ? Math.max(...reqs.map(r => r.id)) + 1 : 1;
    const newReq: MockSolicitacaoCredenciamento = {
      id: newId,
      nome: dados.nomeCompleto,
      crm: dados.crm,
      especialidade: dados.especialidade,
      cidade: dados.cidade,
      estado: dados.estado,
      email: dados.email,
      telefone: dados.telefone,
      instituicao: dados.instituicao,
      status: 'PENDING',
      data_criacao: new Date().toISOString()
    };
    reqs.push(newReq);
    setStorageItem('fragilex_solicitacoes_credenciamento', reqs);
    return newReq;
  },

  listarSolicitacoesCredenciamento(): MockSolicitacaoCredenciamento[] {
    return getStorageItem<MockSolicitacaoCredenciamento[]>('fragilex_solicitacoes_credenciamento', []);
  },

  responderSolicitacaoCredenciamento(idSolicitacao: number, aprovar: boolean, motivoRecusa?: string): { linkAtivacao?: string } {
    const reqs = getStorageItem<MockSolicitacaoCredenciamento[]>('fragilex_solicitacoes_credenciamento', []);
    const index = reqs.findIndex(r => r.id === idSolicitacao);
    if (index === -1) throw new Error('Solicitação não encontrada.');

    const req = reqs[index];
    req.status = aprovar ? 'APPROVED' : 'REJECTED';
    if (!aprovar) req.motivo_recusa = motivoRecusa;
    setStorageItem('fragilex_solicitacoes_credenciamento', reqs);

    if (aprovar) {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      
      const newMedUser: MockUsuario = {
        id: newId,
        nome: req.nome,
        cpf: '',
        email: req.email,
        telefone: req.telefone,
        senha_hash: 'MOCK_HASH',
        role: 'medico',
        status: 'PENDING_ACTIVATION',
        token_ativacao: token,
        data_criacao: new Date().toISOString()
      };
      users.push(newMedUser);
      setStorageItem('fragilex_usuarios', users);

      const medicos = getStorageItem<MockMedico[]>('fragilex_medicos', DEFAULT_MEDICOS);
      const newMedDet: MockMedico = {
        id_usuario: newId,
        crm: req.crm,
        especialidade: req.especialidade,
        cidade: req.cidade,
        estado: req.estado,
        instituicao: req.instituicao
      };
      medicos.push(newMedDet);
      setStorageItem('fragilex_medicos', medicos);

      return { linkAtivacao: `/activate-account?token=${token}` };
    }

    return {};
  },

  salvarChecklistPaciente(idPaciente: number, idMedico: number | null, preenchidoPor: string, sintomasSelecionados: number[], scoreFinal: number): MockChecklist {
    const checklists = getStorageItem<MockChecklist[]>('fragilex_checklists', []);
    const newId = checklists.length > 0 ? Math.max(...checklists.map(c => c.id)) + 1 : 1;
    const newChecklist: MockChecklist = {
      id: newId,
      id_paciente: idPaciente,
      id_medico: idMedico,
      preenchido_por: preenchidoPor,
      score_final: scoreFinal,
      sintomas_selecionados: sintomasSelecionados,
      data_preenchimento: new Date().toISOString()
    };
    checklists.push(newChecklist);
    setStorageItem('fragilex_checklists', checklists);

    const users = getStorageItem<MockUsuario[]>('fragilex_usuarios', DEFAULT_USUARIOS);
    const pacUser = users.find(u => u.id === idPaciente);
    this.logAction(idPaciente, pacUser ? pacUser.nome : 'Paciente', pacUser ? pacUser.role : 'paciente', 'Preenchimento de Checklist', `Checklist formal concluído (Mock). Score Final: ${scoreFinal.toFixed(1)} pts.`);

    return newChecklist;
  },

  obterChecklistsPaciente(idPaciente: number): MockChecklist[] {
    const checklists = getStorageItem<MockChecklist[]>('fragilex_checklists', []);
    return checklists
      .filter(c => c.id_paciente === idPaciente)
      .sort((a, b) => new Date(b.data_preenchimento).getTime() - new Date(a.data_preenchimento).getTime());
  },

  getLandingCards(): LandingCard[] {
    return getStorageItem<LandingCard[]>('fragilex_landing_cards', DEFAULT_CARDS);
  },

  saveLandingCards(cards: LandingCard[]): void {
    setStorageItem('fragilex_landing_cards', cards);
  },

  getLandingNews(): MockNews[] {
    return getStorageItem<MockNews[]>('fragilex_landing_news', DEFAULT_NEWS);
  },

  saveLandingNews(news: MockNews[]): void {
    setStorageItem('fragilex_landing_news', news);
  }
};

// ----------------------------------------------------------------------------
// INTERFACE DE COMUNICAÇÃO (ESCOLHE ENTRE MOCK E CONEXÃO DIRETA COM EXPRESS API)
// ----------------------------------------------------------------------------
const fetchJson = async (path: string, options?: RequestInit) => {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const mockDbService = {
  async logAction(idUsuario: number | null, nomeUsuario: string, role: string, acao: string, detalhes: string): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.logAction(idUsuario, nomeUsuario, role, acao, detalhes);
    }
  },

  async getAudits(): Promise<MockAudit[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getAudits();
    }
    return fetchJson('/api/audits');
  },

  async login(emailOrCpf: string, senha: string): Promise<MockUsuario | null> {
    if (USE_MOCK) {
      try {
        return mockLocalStorageDb.login(emailOrCpf, senha);
      } catch (err: any) {
        throw new Error(err.message || 'Erro ao efetuar login.');
      }
    }
    try {
      return await fetchJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrCpf, senha }),
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getUsuario(id: number): Promise<MockUsuario | null> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getUsuario(id);
    }
    try {
      return await fetchJson(`/api/users/${id}`);
    } catch {
      return null;
    }
  },

  async getPaciente(idUsuario: number): Promise<MockPaciente | null> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getPaciente(idUsuario);
    }
    try {
      return await fetchJson(`/api/patients/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async getMedico(idUsuario: number): Promise<MockMedico | null> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getMedico(idUsuario);
    }
    try {
      return await fetchJson(`/api/doctors/${idUsuario}`);
    } catch {
      return null;
    }
  },

  async listarTodosPacientes(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.listarTodosPacientes();
    }
    return fetchJson('/api/patients');
  },

  async listarTodosUsuarios(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.listarTodosUsuarios();
    }
    return fetchJson('/api/users');
  },

  async atualizarUsuario(id: number, dados: any, adminUser: { id: number; nome: string; role: string }): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.atualizarUsuario(id, dados, adminUser);
      return;
    }
    await fetchJson(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...dados, adminUser }),
    });
  },

  async deletarUsuario(id: number, adminUser: { id: number; nome: string; role: string }): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.deletarUsuario(id, adminUser);
      return;
    }
    await fetchJson(`/api/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminUser }),
    });
  },

  async registrarMedicoDireto(dados: any, adminUser: { id: number; nome: string; role: string }): Promise<MockUsuario> {
    if (USE_MOCK) {
      return mockLocalStorageDb.registrarMedicoDireto(dados, adminUser);
    }
    return fetchJson('/api/doctors/registrar-direto', {
      method: 'POST',
      body: JSON.stringify({ ...dados, adminUser }),
    });
  },

  async listarPacientesDoMedico(idMedico: number): Promise<(MockUsuario & { pacienteDetails?: MockPaciente })[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.listarPacientesDoMedico(idMedico);
    }
    return fetchJson(`/api/patients/medico/${idMedico}`);
  },

  async cadastrarPacientePeloMedico(idMedico: number, dados: any): Promise<{ linkAtivacao: string; token: string }> {
    if (USE_MOCK) {
      return mockLocalStorageDb.cadastrarPacientePeloMedico(idMedico, dados);
    }
    return fetchJson('/api/patients/cadastrar-pelo-medico', {
      method: 'POST',
      body: JSON.stringify({ idMedico, ...dados }),
    });
  },

  async validarTokenAtivacao(token: string): Promise<MockUsuario | null> {
    if (USE_MOCK) {
      return mockLocalStorageDb.validarTokenAtivacao(token);
    }
    try {
      return await fetchJson(`/api/patients/validar-token?token=${encodeURIComponent(token)}`);
    } catch {
      return null;
    }
  },

  async ativarConta(token: string, senha: string): Promise<boolean> {
    if (USE_MOCK) {
      return mockLocalStorageDb.ativarConta(token, senha);
    }
    try {
      const res = await fetchJson('/api/patients/ativar-conta', {
        method: 'POST',
        body: JSON.stringify({ token, senha }),
      });
      return !!res.success;
    } catch {
      return false;
    }
  },

  async autocadastroPaciente(dados: any): Promise<MockUsuario> {
    if (USE_MOCK) {
      return mockLocalStorageDb.autocadastroPaciente(dados);
    }
    return fetchJson('/api/patients/autocadastro', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async importarPacientePorCpf(idMedico: number, cpf: string): Promise<MockVinculo> {
    if (USE_MOCK) {
      return mockLocalStorageDb.importarPacientePorCpf(idMedico, cpf);
    }
    return fetchJson('/api/links/solicitar', {
      method: 'POST',
      body: JSON.stringify({ idMedico, cpf }),
    });
  },

  async listarSolicitacoesVinculoPaciente(idPaciente: number): Promise<MockVinculo[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.listarSolicitacoesVinculoPaciente(idPaciente);
    }
    return fetchJson(`/api/links/paciente/${idPaciente}`);
  },

  async responderSolicitacaoVinculo(idVinculo: number, aceitar: boolean): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.responderSolicitacaoVinculo(idVinculo, aceitar);
      return;
    }
    await fetchJson(`/api/links/${idVinculo}/responder`, {
      method: 'POST',
      body: JSON.stringify({ aceitar }),
    });
  },

  async solicitarCredenciamentoMedico(dados: any): Promise<MockSolicitacaoCredenciamento> {
    if (USE_MOCK) {
      return mockLocalStorageDb.solicitarCredenciamentoMedico(dados);
    }
    return fetchJson('/api/doctors/solicitar', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async listarSolicitacoesCredenciamento(): Promise<MockSolicitacaoCredenciamento[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.listarSolicitacoesCredenciamento();
    }
    return fetchJson('/api/doctors/solicitacoes');
  },

  async responderSolicitacaoCredenciamento(idSolicitacao: number, aprovar: boolean, motivoRecusa?: string): Promise<{ linkAtivacao?: string }> {
    if (USE_MOCK) {
      return mockLocalStorageDb.responderSolicitacaoCredenciamento(idSolicitacao, aprovar, motivoRecusa);
    }
    return fetchJson(`/api/doctors/solicitacoes/${idSolicitacao}/responder`, {
      method: 'POST',
      body: JSON.stringify({ aprovar, motivoRecusa }),
    });
  },

  async salvarChecklistPaciente(idPaciente: number, idMedico: number | null, preenchidoPor: string, sintomasSelecionados: number[], scoreFinal: number): Promise<MockChecklist> {
    if (USE_MOCK) {
      return mockLocalStorageDb.salvarChecklistPaciente(idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal);
    }
    return fetchJson('/api/checklists', {
      method: 'POST',
      body: JSON.stringify({ idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal }),
    });
  },

  async obterChecklistsPaciente(idPaciente: number): Promise<MockChecklist[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.obterChecklistsPaciente(idPaciente);
    }
    return fetchJson(`/api/checklists/paciente/${idPaciente}`);
  },

  async getLandingCards(): Promise<LandingCard[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getLandingCards();
    }
    return fetchJson('/api/landing/cards');
  },

  async saveLandingCards(cards: LandingCard[]): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.saveLandingCards(cards);
      return;
    }
    await fetchJson('/api/landing/cards', {
      method: 'POST',
      body: JSON.stringify(cards),
    });
  },

  async getLandingNews(): Promise<MockNews[]> {
    if (USE_MOCK) {
      return mockLocalStorageDb.getLandingNews();
    }
    return fetchJson('/api/landing/news');
  },

  async saveLandingNews(news: MockNews[]): Promise<void> {
    if (USE_MOCK) {
      mockLocalStorageDb.saveLandingNews(news);
      return;
    }
    await fetchJson('/api/landing/news', {
      method: 'POST',
      body: JSON.stringify(news),
    });
  }
};
