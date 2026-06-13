import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Login = () => {
  const { loginComCredenciais } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    const res = await loginComCredenciais(username, password);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(res.error || "Erro ao efetuar login.");
    }
  };

  return (
    <div className="checklist-wrapper">
      <div
        className="checklist-container"
        style={{ maxWidth: "450px", width: "100%", padding: "32px", position: "relative" }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "none",
            border: "none",
            color: "#1a5fa8",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ← Voltar
        </button>
        <h1
          className="checklist-title"
          style={{ marginTop: "20px" }}
        >
          Acesso ao Sistema
        </h1>
        <p className="checklist-subtitle">Faça login com sua conta ou utilize o acesso rápido.</p>

        {errorMessage && (
          <div
            style={{
              background: "rgba(255, 77, 79, 0.15)",
              border: "1px solid #ff4d4f",
              color: "#ff4d4f",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleCredentialsSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}
        >
          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">E-mail ou CPF</label>
            <input
              type="text"
              className="cadastro-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="exemplo@email.com ou 123.456.789-00"
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Senha</label>
            <input
              type="password"
              className="cadastro-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button
            type="submit"
            className="checklist-submit-btn"
            style={{ width: "100%", marginTop: "8px" }}
          >
            Entrar
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            type="button"
            className="hero-btn-secondary"
            style={{ padding: "8px 16px", fontSize: "14px" }}
            onClick={() => navigate("/")}
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
