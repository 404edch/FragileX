import type { Sintoma } from "../../../shared/classes/sintoma";
import { URL_API } from "../config/api";

export async function getSintomas() {
  try {
    const response = await fetch(`${URL_API}/sintomas`);
    if (!response.ok) {
      throw new Error(`Erro na requisição, status: ${response.status}`);
    }
    const sintomas: Sintoma[] = await response.json();
    return sintomas;
  } catch (error) {
    console.error("Erro ao obter sintomas:", error);
    throw error;
  }
}
