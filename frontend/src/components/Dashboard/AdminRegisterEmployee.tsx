import React, { useState } from "react";
import { api } from "../../services/api";

export default function AdminRegisterEmployee() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (cpf.length !== 11 || /^\d{11}$/.test(cpf) === false) {
      setErrorMessage("CPF Inválido.");
      return;
    }

    try {
      await api.post("/users/employee", {
        nome,
        email,
        cpf,
        telefone,
        senha,
      });
      setSuccessMessage(`Funcionário ${nome} cadastrado com sucesso!`);
      setNome("");
      setEmail("");
      setCpf("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao cadastrar funcionário. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>Cadastrar Novo Funcionário</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
          Registre contas de administração ou funcionários da instituição.
        </p>
      </div>

      {successMessage && (
        <div
          style={{
            background: "rgba(82, 196, 26, 0.15)",
            border: "1px solid #52c41a",
            color: "#52c41a",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: "rgba(255, 77, 79, 0.15)",
            border: "1px solid #ff4d4f",
            color: "#ff4d4f",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <form
          onSubmit={handleRegister}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
        >
          <div
            className="cadastro-item"
            style={{ gridColumn: "span 2" }}
          >
            <label className="cadastro-label">Nome Completo</label>
            <input
              type="text"
              className="cadastro-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="cadastro-item">
            <label className="cadastro-label">E-mail Corporativo</label>
            <input
              type="email"
              className="cadastro-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@instituto.com"
              required
            />
          </div>

          <div className="cadastro-item">
            <label className="cadastro-label">CPF</label>
            <input
              type="text"
              className="cadastro-input"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ gridColumn: "span 2" }}
          >
            <label className="cadastro-label">Telefone (Opcional)</label>
            <input
              type="text"
              className="cadastro-input"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="cadastro-item">
            <label className="cadastro-label">Senha Provisória</label>
            <input
              type="password"
              className="cadastro-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite uma senha"
              required
            />
          </div>

          <div className="cadastro-item">
            <label className="cadastro-label">Confirmar Senha</label>
            <input
              type="password"
              className="cadastro-input"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a senha"
              required
            />
          </div>

          <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
            <button
              type="submit"
              className="checklist-submit-btn"
              style={{ width: "100%", margin: 0 }}
            >
              Registrar Funcionário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
