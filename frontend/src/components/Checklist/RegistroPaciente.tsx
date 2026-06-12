import React, { useState } from "react";
import DadosPessoais from "./DadosPessoais";
import BotaoInicio from "../Shared/BotaoInicio";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { backendService, type MockUsuario } from "../../services/backendService";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";

export default function RegistroPaciente() {
  const { usuario, loginComCredenciais } = useAuth();
  const navigate = useNavigate();
  const isMedico = usuario?.role === "medico" || usuario?.role === "instituto";

  const [errorMessage, setErrorMessage] = useState("");
  const [activationLink, setActivationLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [cpfValue, setCpfValue] = useState("");
  const [existingUser, setExistingUser] = useState<MockUsuario | null>(null);

  const handleCpfBlur = async (cpf: string) => {
    if (!cpf || cpf.length !== 11 || !isMedico) return;
    try {
      const res = await backendService.checkCpf(cpf);
      if (res.exists && res.user) {
        setExistingUser(res.user);
      } else {
        setExistingUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVincular = async () => {
    if (!usuario || !existingUser) return;
    try {
      await backendService.importarPacientePorCpf(usuario.id, cpfValue);
      alert("Solicitação de vínculo enviada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao solicitar vínculo.");
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    const dadosPessoais: any = Object.fromEntries(formData.entries());

    let foto_perfil = "";
    const fotoFile = formData.get("foto_perfil_file") as File;
    if (fotoFile && fotoFile.size > 0) {
      try {
        foto_perfil = await toBase64(fotoFile);
      } catch (err) {
        setErrorMessage("Erro ao processar a foto.");
        return;
      }
    }

    if (isMedico) {
      try {
        const res = await api.post<{ linkAtivacao: string; token: string }>("/patients/cadastrar-pelo-medico", {
          idMedico: usuario!.id,
          nomePaciente: dadosPessoais.nomePaciente,
          cpfPaciente: dadosPessoais.cpfPaciente,
          email: dadosPessoais.email,
          telefone: dadosPessoais.telefone,
          dataNascimento: dadosPessoais.dataNascimento,
          sexo_biologico: dadosPessoais.sexo_biologico,
          genero: dadosPessoais.genero,
          nomeMae: dadosPessoais.nomeMae,
          nomePai: dadosPessoais.nomePai,
          nomeResponsavel: dadosPessoais.nomeResponsavel,
          grauParentesco: dadosPessoais.grauParentesco,
          cpfResponsavel: dadosPessoais.cpfResponsavel,
          cidade: dadosPessoais.cidade,
          estado: dadosPessoais.estado,
          pais: dadosPessoais.pais,
          telefone2: dadosPessoais.telefone2,
          whatsapp: dadosPessoais.whatsapp,
          foto_perfil,
        });
        const fullLink = `${window.location.origin}${res.linkAtivacao}`;
        setActivationLink(fullLink);
      } catch (error: any) {
        setErrorMessage(error.message || "Erro ao registrar paciente. Tente novamente.");
      }
    } else {
      // Autocadastro de paciente
      if (dadosPessoais.senha !== dadosPessoais.confirmarSenha) {
        setErrorMessage("As senhas não coincidem. Por favor, verifique.");
        return;
      }

      try {
        await api.post("/patients/autocadastro", {
          nomePaciente: dadosPessoais.nomePaciente,
          cpfPaciente: dadosPessoais.cpfPaciente,
          email: dadosPessoais.email,
          telefone: dadosPessoais.telefone,
          senha: dadosPessoais.senha,
          dataNascimento: dadosPessoais.dataNascimento,
          sexo_biologico: dadosPessoais.sexo_biologico,
          genero: dadosPessoais.genero,
          nomeMae: dadosPessoais.nomeMae,
          nomePai: dadosPessoais.nomePai,
          nomeResponsavel: dadosPessoais.nomeResponsavel,
          grauParentesco: dadosPessoais.grauParentesco,
          cpfResponsavel: dadosPessoais.cpfResponsavel,
          cidade: dadosPessoais.cidade,
          estado: dadosPessoais.estado,
          pais: dadosPessoais.pais,
          telefone2: dadosPessoais.telefone2,
          whatsapp: dadosPessoais.whatsapp,
          foto_perfil,
        });

        await loginComCredenciais(dadosPessoais.cpfPaciente as string, dadosPessoais.senha as string);
        alert("Cadastro realizado com sucesso!");
        navigate("/dashboard");
      } catch (error: any) {
        if (error.message === "REGISTRADO_PELO_MEDICO") {
          setErrorMessage(
            "Um profissional de saúde já iniciou o seu cadastro no sistema. Por favor, utilize o link de ativação enviado para definir sua senha ou entre em contato com seu médico.",
          );
        } else if (error.message === "CPF_EXISTENTE") {
          setErrorMessage("Já encontramos um cadastro associado a este CPF. Faça login para acessar sua conta.");
        } else if (error.message === "EMAIL_EXISTENTE") {
          setErrorMessage("Já encontramos um cadastro associado a este E-mail. Faça login para acessar sua conta.");
        } else {
          setErrorMessage("Erro ao realizar o cadastro. Tente novamente.");
        }
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (activationLink) {
    return (
      <div
        className="checklist-wrapper"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div
          className="checklist-container"
          style={{ maxWidth: "600px", width: "100%", textAlign: "center", padding: "40px" }}
        >
          <div style={{ fontSize: "48px", color: "#52c41a", marginBottom: "16px" }}>✓</div>
          <h1 className="checklist-title">Paciente Cadastrado!</h1>
          <p
            className="checklist-subtitle"
            style={{ marginBottom: "28px" }}
          >
            O registro do paciente foi criado no estado <strong>PENDING_ACTIVATION</strong>. Como medida de segurança, o médico não cria nem conhece a senha.
          </p>

          <div
            style={{
              background: "rgba(26, 95, 168, 0.05)",
              border: "1px solid rgba(26, 95, 168, 0.2)",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "left",
              marginBottom: "28px",
            }}
          >
            <h4 style={{ color: "#1a5fa8", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}>
              Link Temporário de Ativação
            </h4>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Copie o link abaixo para enviar ao paciente via E-mail ou WhatsApp:</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                readOnly
                value={activationLink}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                  background: "#fff",
                }}
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="checklist-submit-btn"
                style={{ padding: "0 16px", margin: 0, fontSize: "13px", whiteSpace: "nowrap" }}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              type="button"
              className="checklist-submit-btn"
              onClick={() => window.open(activationLink, "_blank")}
              style={{ background: "#52c41a", border: "none" }}
            >
              Simular Ativação (Abrir em nova aba)
            </button>
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={() => navigate("/dashboard")}
              style={{ width: "100%" }}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checklist-wrapper">
      <form
        onSubmit={handleSubmit}
        className="cadastro-form"
        style={{ position: "relative", paddingTop: "40px" }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
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

        {errorMessage && (
          <div
            style={{
              background: "rgba(255, 77, 79, 0.15)",
              border: "1px solid #ff4d4f",
              color: "#ff4d4f",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "14px",
              marginBottom: "24px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}

        {existingUser && (
          <div
            style={{
              background: "#e0f2fe",
              border: "1px solid #7dd3fc",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 4px", color: "#0369a1", fontSize: "16px", fontWeight: "bold" }}>Paciente já existe no sistema!</h3>
              <p style={{ margin: 0, color: "#0284c7", fontSize: "14px" }}>
                O paciente <strong>{existingUser.nome}</strong> já possui cadastro.
              </p>
            </div>
            <button
              type="button"
              onClick={handleVincular}
              style={{
                background: "#0ea5e9",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Vincular a este Paciente
            </button>
          </div>
        )}

        <DadosPessoais
          isMedico={isMedico}
          cpfValue={cpfValue}
          onCpfChange={(e) => setCpfValue(e.target.value)}
          onCpfBlur={handleCpfBlur}
        />

        <div
          className="form-actions"
          style={{ gap: "16px" }}
        >
          <BotaoInicio label="Cancelar" />
          <button
            type="submit"
            className="checklist-submit-btn"
            disabled={!!existingUser}
          >
            Finalizar Cadastro do Paciente
          </button>
        </div>
      </form>
    </div>
  );
}
