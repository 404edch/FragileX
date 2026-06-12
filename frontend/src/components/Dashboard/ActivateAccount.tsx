import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import ItemCadastro from '../Checklist/ItemCadastro';
import BotaoInicio from '../Shared/BotaoInicio';
import '../Checklist/Checklist.css';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [usuario, setUsuario] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (token) {
        try {
          const user = await api.get(`/patients/validar-token?token=${token}`);
          if (user) {
            setUsuario(user);
          }
        } catch (e: any) {
          console.error("Token inválido ou expirado", e);
        }
      }
      setLoading(false);
    };
    validate();
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    const submit = async () => {
      if (token) {
        try {
          await api.post('/patients/ativar-conta', { token, senha: password });
          setSuccess(true);
        } catch (e: any) {
          setErrorMessage(e.response?.data?.error || 'Erro ao tentar ativar a conta. Link expirado ou inválido.');
        }
      }
    };
    submit();
  };

  if (loading) {
    return (
      <div className="checklist-wrapper">
        <div className="checklist-container">
          <h2 className="checklist-loading">Validando convite de ativação...</h2>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checklist-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="checklist-container" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>✓</div>
          <h1 className="checklist-title">Conta Ativada!</h1>
          <p className="checklist-subtitle" style={{ marginBottom: '28px' }}>
            Sua conta foi ativada com sucesso. Você já pode fazer login no sistema do Instituto Buko Kaesemodel usando seu e-mail ou CPF e a senha que acabou de cadastrar.
          </p>
          <button
            type="button"
            className="checklist-submit-btn"
            style={{ width: '100%' }}
            onClick={() => navigate('/login')}
          >
            Acessar o Sistema
          </button>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="checklist-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="checklist-container" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }}>⚠</div>
          <h1 className="checklist-title">Convite Inválido</h1>
          <p className="checklist-subtitle" style={{ marginBottom: '28px' }}>
            O link de ativação é inválido ou já foi utilizado. Caso precise de um novo link, entre em contato com o médico responsável ou suporte do Instituto.
          </p>
          <BotaoInicio label="Voltar ao Início" />
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
      <form onSubmit={handleSubmit} className="cadastro-form" style={{ maxWidth: '500px', width: '100%', marginTop: '32px' }}>
        <div className="checklist-container" style={{ marginBottom: '24px' }}>
          <h1 className="checklist-title">Ativar Conta</h1>
          <p className="checklist-subtitle">
            Olá, <strong>{usuario.nome}</strong>! Defina sua senha abaixo para concluir a ativação de sua conta de {usuario.role === 'medico' ? 'Médico Parceiro' : 'Paciente'}.
          </p>

          <p style={{ fontSize: '13px', color: '#666', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>
            <strong>Usuário (E-mail):</strong> {usuario.email}<br />
            {usuario.cpf && usuario.cpf !== '00000000000' && (
              <><strong>CPF:</strong> {usuario.cpf}</>
            )}
          </p>

          {errorMessage && (
            <div style={{
              background: 'rgba(255, 77, 79, 0.15)',
              border: '1px solid #ff4d4f',
              color: '#ff4d4f',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="cadastro-item" style={{ width: '100%' }}>
              <label className="cadastro-label">Nova Senha</label>
              <input
                type="password"
                className="cadastro-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="cadastro-item" style={{ width: '100%' }}>
              <label className="cadastro-label">Confirmar Senha</label>
              <input
                type="password"
                className="cadastro-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio label="Cancelar" />
          <button type="submit" className="checklist-submit-btn">
            Ativar Minha Conta
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivateAccount;
