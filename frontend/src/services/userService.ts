import { Usuario } from "../contexts/AuthContext";
import { api } from "./api";
import { MockUsuario, MockPaciente, MockMedico } from "./types";

export const userService = {
  async getUsuario(id: number): Promise<MockUsuario | null> {
    try {
      return await api.get<MockUsuario>(`/users/${id}`);
    } catch {
      return null;
    }
  },

  async listarTodosUsuarios(): Promise<(MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[]> {
    return api.get<(MockUsuario & { pacienteDetails?: MockPaciente; medicoDetails?: MockMedico })[]>("/users");
  },

  async atualizarUsuario(id: number, dados: object, adminUser: Usuario): Promise<void> {
    await api.put(`/users/${id}`, { ...dados, adminUser });
  },

  async deletarUsuario(id: number, adminUser: Usuario): Promise<void> {
    await api.delete(`/users/${id}`, { adminUser });
  },
};
