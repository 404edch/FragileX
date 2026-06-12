import React, { useState } from 'react';
import ItemCadastro from '../../Checklist/ItemCadastro';
import BotaoInicio from '../../Shared/BotaoInicio';
import '../../Checklist/Checklist.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

const AplicacaoMedico = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    try {
      await api.post('/doctors/solicitar', {
        nomeCompleto: dados.nomeCompleto,
        crm: dados.crm,
        especialidade: dados.especialidade,
        cidade: dados.cidade,
        estado: dados.estado,
        email: dados.email,
        telefone: dados.telefone,
        instituicao: dados.instituicao,
        senha: dados.senha,
      });
      setSuccessData(dados);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao enviar solicitação.');
    }
  };

  if (successData) {
    return (
      <div className="checklist-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="checklist-container" style={{ maxWidth: '600px', width: '100%', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>✉</div>
          <h1 className="checklist-title">Solicitação Enviada!</h1>
          <p className="checklist-subtitle" style={{ marginBottom: '24px' }}>
            Sua solicitação de credenciamento foi registrada com sucesso e enviada ao Instituto.
          </p>

          <div style={{
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'left',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#333',
            marginBottom: '28px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px', color: '#1a5fa8' }}>
              [SIMULAÇÃO DE E-MAIL ENVIADO]
            </div>
            <strong>Assunto:</strong> Solicitação de Credenciamento Médico<br /><br />
            <strong>Corpo do E-mail:</strong><br />
            Nome: {successData.nomeCompleto}<br />
            CRM: {successData.crm}<br />
            Especialidade: {successData.especialidade}<br />
            Telefone: {successData.telefone}<br />
            Email: {successData.email}<br />
            Cidade/UF: {successData.cidade} - {successData.estado}<br />
            Instituição: {successData.instituicao || 'N/A'}<br />
          </div>

          <button
            type="button"
            className="checklist-submit-btn"
            style={{ width: '100%' }}
            onClick={() => navigate('/')}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checklist-wrapper" style={{ position: 'relative' }}>
      <button 
        type="button"
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: '#1a5fa8', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', zIndex: 10 }}
      >
        ← Voltar
      </button>
      <form onSubmit={handleApply} className="cadastro-form" style={{ marginTop: '32px' }}>
        <div className="checklist-container" style={{ marginBottom: "24px" }}>
          <h1 className="checklist-title">Seja um Médico Parceiro</h1>
          <p className="checklist-subtitle">Preencha o formulário abaixo para solicitar acesso ao sistema do Instituto Buko Kaesemodel.</p>

          {errorMessage && (
            <div style={{
              background: 'rgba(255, 77, 79, 0.15)',
              border: '1px solid #ff4d4f',
              color: '#ff4d4f',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {errorMessage}
            </div>
          )}

          <div className="cadastro-grid">
            <ItemCadastro label="Nome Completo" name="nomeCompleto" required />
            <ItemCadastro label="CRM" name="crm" required />
            <ItemCadastro label="Especialidade" name="especialidade" required />
            <ItemCadastro label="Cidade" name="cidade" required />
            <ItemCadastro label="Estado (UF)" name="estado" required />
            <ItemCadastro label="E-mail profissional" name="email" type="email" required />
            <ItemCadastro label="Telefone para contato" name="telefone" type="tel" required />
            <ItemCadastro label="Instituição de Atuação" name="instituicao" required />
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ItemCadastro label="Senha de Acesso" name="senha" type="password" required />
              <ItemCadastro label="Confirmar Senha" name="confirmarSenha" type="password" required />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <ItemCadastro label="Link para Currículo Lattes ou LinkedIn (Opcional)" name="linkCurriculo" type="url" />
          </div>
        </div>

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio label="Cancelar" />
          <button type="submit" className="checklist-submit-btn">
            Enviar Solicitação
          </button>
        </div>
      </form>
    </div>
  );
};

export default AplicacaoMedico;

