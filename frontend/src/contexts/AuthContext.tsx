import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mockDbService, type MockUsuario } from '../services/mockDbService';

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
      const user = JSON.parse(sessao);
      mockDbService.getUsuario(user.id).then((atualizado) => {
        if (atualizado) {
          setUsuario(atualizado);
        } else {
          setUsuario(user);
        }
      }).catch(() => {
        setUsuario(user);
      });
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
      const user = await mockDbService.login(emailOuCpf, senha);
      if (!user) {
        return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail/CPF e senha.' };
      }
      if (user.status === 'PENDING_ACTIVATION') {
        return { success: false, error: 'Esta conta ainda não foi ativada. Por favor, utilize o link de ativação enviado.' };
      }
      setUsuario(user);
      localStorage.setItem('fragilex_sessao', JSON.stringify(user));
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
    if (usuario) {
      try {
        const atualizado = await mockDbService.getUsuario(usuario.id);
        if (atualizado) {
          setUsuario(atualizado);
          localStorage.setItem('fragilex_sessao', JSON.stringify(atualizado));
        }
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário logado:", error);
      }
    }
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
