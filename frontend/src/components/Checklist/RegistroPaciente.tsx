import React, { useState } from "react";
import DadosPessoais from "./DadosPessoais";
import BotaoInicio from "../Shared/BotaoInicio";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";


export default function RegistroPaciente() {
  const { usuario, loginComCredenciais } = useAuth();
  const navigate = useNavigate();
  const isMedico = usuario?.role === 'medico' || usuario?.role === 'instituto';

  const [errorMessage, setErrorMessage] = useState("");
  const [activationLink, setActivationLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    const dadosPessoais = Object.fromEntries(formData.entries());

    if (isMedico) {
    try {
        const res = await api.post<{ linkAtivacao: string; token: string }>('/patients/cadastrar-pelo-medico', {
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
        await api.post('/patients/autocadastro', {
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
        });
        
        // Logar automaticamente
        await loginComCredenciais(dadosPessoais.cpfPaciente as string, dadosPessoais.senha as string);
        alert("Cadastro realizado com sucesso!");
        navigate('/dashboard');
      } catch (error: any) {
        if (error.message === 'REGISTRADO_PELO_MEDICO') {
          setErrorMessage("Um profissional de saúde já iniciou o seu cadastro no sistema. Por favor, utilize o link de ativação enviado para definir sua senha ou entre em contato com seu médico.");
        } else if (error.message === 'CPF_EXISTENTE') {
          setErrorMessage("Já encontramos um cadastro associado a este CPF. Faça login para acessar sua conta.");
        } else if (error.message === 'EMAIL_EXISTENTE') {
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

  // Se o médico acabou de cadastrar e o link de ativação foi gerado, exibe o modal/tela de sucesso
  if (activationLink) {
    return (
      <div className="checklist-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="checklist-container" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>✓</div>
          <h1 className="checklist-title">Paciente Cadastrado!</h1>
          <p className="checklist-subtitle" style={{ marginBottom: '28px' }}>
            O registro do paciente foi criado no estado <strong>PENDING_ACTIVATION</strong>.
            Como medida de segurança, o médico não cria nem conhece a senha.
          </p>

          <div style={{
            background: 'rgba(26, 95, 168, 0.05)',
            border: '1px solid rgba(26, 95, 168, 0.2)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'left',
            marginBottom: '28px'
          }}>
            <h4 style={{ color: '#1a5fa8', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Link Temporário de Ativação
            </h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              Copie o link abaixo para enviar ao paciente via E-mail ou WhatsApp:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={activationLink}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '12px',
                  background: '#fff'
                }}
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="checklist-submit-btn"
                style={{ padding: '0 16px', margin: 0, fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="checklist-submit-btn"
              onClick={() => window.open(activationLink, '_blank')}
              style={{ background: '#52c41a', border: 'none' }}
            >
              Simular Ativação (Abrir em nova aba)
            </button>
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={() => navigate('/dashboard')}
              style={{ width: '100%' }}
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
      <form onSubmit={handleSubmit} className="cadastro-form">
        {errorMessage && (
          <div style={{
            background: 'rgba(255, 77, 79, 0.15)',
            border: '1px solid #ff4d4f',
            color: '#ff4d4f',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {errorMessage}
          </div>
        )}

        <DadosPessoais isMedico={isMedico} />

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio label="Cancelar" />
          <button type="submit" className="checklist-submit-btn">
            Finalizar Cadastro do Paciente
          </button>
        </div>
      </form>
    </div>
  );
}

