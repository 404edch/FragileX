import { api } from './api';
import { MockUsuario } from './types';

export const authService = {
  async login(emailOrCpf: string, senha: string): Promise<MockUsuario | null> {
    try {
      const response = await api.post<{ message: string; token: string; user: MockUsuario }>('/auth/login', { emailOrCpf, senha });
      return response.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
