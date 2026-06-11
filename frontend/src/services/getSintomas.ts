import type { Sintoma } from "../../../shared/classes/sintoma";
import { URL_API } from "../config/api";

const MOCK_SINTOMAS: Sintoma[] = [
  { id: 1, nome: "Atraso no desenvolvimento intelectual", peso_M: 3.5, peso_F: 2.0, possui: false },
  { id: 2, nome: "Atraso na fala ou linguagem", peso_M: 3.0, peso_F: 1.5, possui: false },
  { id: 3, nome: "Hiperatividade ou déficit de atenção", peso_M: 2.5, peso_F: 1.0, possui: false },
  { id: 4, nome: "Comportamento autista ou isolamento", peso_M: 3.0, peso_F: 2.0, possui: false },
  { id: 5, nome: "Evitar contato visual", peso_M: 2.0, peso_F: 1.0, possui: false },
  { id: 6, nome: "Orelhas grandes ou proeminentes", peso_M: 4.0, peso_F: 1.0, possui: false },
  { id: 7, nome: "Rosto alongado", peso_M: 3.5, peso_F: 1.0, possui: false },
  { id: 8, nome: "Articulações muito flexíveis", peso_M: 2.5, peso_F: 1.5, possui: false },
  { id: 9, nome: "Ansiedade social ou timidez excessiva", peso_M: 2.0, peso_F: 2.5, possui: false },
  { id: 10, nome: "Pés chatos", peso_M: 1.5, peso_F: 0.5, possui: false }
];

export async function getSintomas(): Promise<Sintoma[]> {
  try {
    const response = await fetch(`${URL_API}/sintomas`);
    if (!response.ok) {
      throw new Error(`Erro na requisição, status: ${response.status}`);
    }
    const sintomas: Sintoma[] = await response.json();
    return sintomas;
  } catch (error) {
    console.warn("API de sintomas indisponível. Usando dados locais de simulação.");
    return MOCK_SINTOMAS;
  }
}

