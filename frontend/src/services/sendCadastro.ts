import { URL_API } from "../config/api";

export async function sendCadastro(dadosFinais: object) {
  try {
    const response = await fetch(`${URL_API}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosFinais),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição, status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar cadastro:", error);
    throw error;
  }
}
