import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mockDbService, type MockUsuario } from '../services/mockDbService';
import { api } from '../services/api';

export type Role = 'medico' | 'instituto' | 'paciente' | 'admin' | null;

export interface Usuario {
  id: number;
  email: string;
  role: Role;
  nome: string;
  cpf: string;
  telefone?: string;
  status: 'PENDING_ACTIVATION' | 'ACTIVE';
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (role: Role) => Promise<boolean>;
  loginComCredenciais: (emailOuCpf: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  atualizarUsuarioLogado: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Carrega o usuário da sessão/localStorage se existir
  useEffect(() => {
    const sessao = localStorage.getItem('fragilex_sessao');
    if (sessao) {
      try {
        const user = JSON.parse(sessao);
        setUsuario(user);
      } catch (e) {
        console.error('Erro ao ler sessão', e);
      }
    }
  }, []);

  const login = async (role: Role): Promise<boolean> => {
    if (!role) return false;
    const emailMap: Record<string, string> = {
      instituto: 'instituto@teste.com',
      medico: 'medico@teste.com',
      paciente: 'paciente@teste.com',
      admin: 'admin@teste.com',
    };
    const email = emailMap[role];
    const user = await mockDbService.login(email, '123456');
    if (user) {
      setUsuario(user);
      localStorage.setItem('fragilex_sessao', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const loginComCredenciais = async (emailOuCpf: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Usar a api real apontando para o backend
      const response = await api.post<{ message: string; token: string; user: any }>('/auth/login', {
        emailOrCpf: emailOuCpf,
        senha
      });

      const userToStore = {
        ...response.user,
        token: response.token,
      };

      setUsuario(userToStore);
      localStorage.setItem('fragilex_sessao', JSON.stringify(userToStore));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Erro ao tentar fazer login.' };
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('fragilex_sessao');
  };

  const atualizarUsuarioLogado = async () => {
    // Implementar busca do /auth/me futuro, caso necessário.
    // Por enquanto confiamos no payload salvo no localStorage + token
  };

  return (
    <AuthContext.Provider value={{ usuario, login, loginComCredenciais, logout, atualizarUsuarioLogado }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
