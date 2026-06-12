import type { Sintoma } from "../../../shared/classes/sintoma";
import { api } from "./api";

export async function getSintomas(): Promise<Sintoma[]> {
  try {
    const response = await api.get('/sintomas');
    // api.get returns response.data automatically from our interceptor
    return response as unknown as Sintoma[];
  } catch (error) {
    console.error("Erro ao buscar sintomas do banco de dados:", error);
    throw error;
  }
}
