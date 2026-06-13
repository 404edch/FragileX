import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

export default function AdminMedics() {
  const { usuario } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!usuario) {
      setError("Ação não autorizada. Faça login novamente.");
      return;
    }

    if (cpf && (cpf.length !== 11 || /^\d{11}$/.test(cpf) === false)) {
      setError("CPF Inválido.");
      return;
    }

    try {
      await api.post("/doctors/registrar-direto", {
        nomeCompleto,
        crm,
        especialidade,
        email,
        telefone,
        cidade,
        estado,
        instituicao,
        senha,
        cpf,
        adminUser: {
          id: usuario.id,
          nome: usuario.nome,
          role: usuario.role || "admin",
        },
      });

      setSuccess(true);
      // Reset form
      setNomeCompleto("");
      setCrm("");
      setEspecialidade("");
      setEmail("");
      setTelefone("");
      setCidade("");
      setEstado("");
      setInstituicao("");
      setSenha("");
      setCpf("");

      // Auto-hide success alert
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar médico.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>Registrar Novo Médico</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
          Cadastre uma conta de médico ativada diretamente no sistema. Ele poderá acessar imediatamente utilizando o e-mail ou CRM e a senha cadastrada.
        </p>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      {success && (
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
          Médico cadastrado com sucesso! A conta está ativa e pronta para uso.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "28px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Nome Completo *</label>
            <input
              type="text"
              className="cadastro-input"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              placeholder="Dr(a). Nome Sobrenome"
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">CRM *</label>
            <input
              type="text"
              className="cadastro-input"
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
              placeholder="Ex: CRM-12345"
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">E-mail *</label>
            <input
              type="email"
              className="cadastro-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="medico@email.com"
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">CPF (Opcional)</label>
            <input
              type="text"
              className="cadastro-input"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Apenas números (Ex: 12345678901)"
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Especialidade *</label>
            <input
              type="text"
              className="cadastro-input"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              placeholder="Ex: Neuropediatra, Geneticista..."
              required
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Telefone</label>
            <input
              type="tel"
              className="cadastro-input"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(41) 99999-9999"
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Instituição de Saúde</label>
            <input
              type="text"
              className="cadastro-input"
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              placeholder="Ex: Hospital Pequeno Príncipe"
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Senha de Acesso Inicial *</label>
            <input
              type="password"
              className="cadastro-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Cidade</label>
            <input
              type="text"
              className="cadastro-input"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Ex: Curitiba"
            />
          </div>

          <div
            className="cadastro-item"
            style={{ width: "100%" }}
          >
            <label className="cadastro-label">Estado (UF)</label>
            <input
              type="text"
              className="cadastro-input"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex: PR"
              maxLength={2}
            />
          </div>
        </div>

        <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="checklist-submit-btn"
            style={{ width: "auto", padding: "12px 32px", margin: 0 }}
          >
            Cadastrar e Ativar Médico
          </button>
        </div>
      </form>
    </div>
  );
}
