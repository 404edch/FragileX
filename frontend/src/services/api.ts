import { Usuario } from "../contexts/AuthContext";

const API_URL = "http://localhost:3000/api";

class ApiService {
  private getHeaders() {
    const sessao = localStorage.getItem("fragilex_sessao");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessao) {
      try {
        const user = JSON.parse(sessao);
        if (user && user.token) {
          headers["Authorization"] = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Erro ao analisar sessão", e);
      }
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(
    endpoint: string,
    body: {
      adminUser: Usuario;
    },
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiService();
