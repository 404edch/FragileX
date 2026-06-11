import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../../../contexts/AuthContext';

const ROLE_OPTIONS: { role: Role; label: string; color?: string }[] = [
  { role: 'paciente', label: 'Entrar como Paciente' },
  { role: 'medico', label: 'Entrar como Médico', color: '#4a5568' },
  { role: 'instituto', label: 'Entrar como Instituto', color: '#2b6cb0' },
  { role: 'admin', label: 'Entrar como Administrador', color: '#d69e2e' },
];

const Login = () => {
  const { login, loginComCredenciais } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = async (role: Role) => {
    const success = await login(role);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    const res = await loginComCredenciais(username, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Erro ao efetuar login.');
    }
  };

  return (
    <div className="checklist-wrapper">
      <div className="checklist-container" style={{ maxWidth: '450px', width: '100%', padding: '32px' }}>
        <h1 className="checklist-title">Acesso ao Sistema</h1>
        <p className="checklist-subtitle">Faça login com sua conta ou utilize o acesso rápido.</p>

        {errorMessage && (
          <div style={{
            background: 'rgba(255, 77, 79, 0.15)',
            border: '1px solid #ff4d4f',
            color: '#ff4d4f',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div className="cadastro-item" style={{ width: '100%' }}>
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

          <div className="cadastro-item" style={{ width: '100%' }}>
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

          <button type="submit" className="checklist-submit-btn" style={{ width: '100%', marginTop: '8px' }}>
            Entrar
          </button>
        </form>

        <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
          <hr style={{ border: '0', borderTop: '1px solid rgba(0,0,0,0.1)' }} />
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            padding: '0 12px',
            fontSize: '13px',
            color: '#777'
          }}>
            Acesso Rápido (Mock)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          {ROLE_OPTIONS.map(({ role, label, color }) => (
            <button
              key={role}
              type="button"
              className="checklist-submit-btn"
              style={{
                backgroundColor: color || '#1a5fa8',
                padding: '10px 16px',
                fontSize: '13px',
                width: '100%'
              }}
              onClick={() => handleQuickLogin(role)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button type="button" className="hero-btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => navigate('/')}>
            Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

