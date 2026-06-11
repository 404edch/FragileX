import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'medico' | 'instituto' | 'paciente' | null;

export interface Usuario {
  email: string;
  role: Role;
  nome: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (role: Role) => {
    if (!role) return;
    setUsuario({
      email: `${role}@teste.com`,
      nome: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role
    });
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
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
