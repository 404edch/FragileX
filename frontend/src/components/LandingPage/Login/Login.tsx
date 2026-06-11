import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../../../contexts/AuthContext';

const ROLE_OPTIONS: { role: Role; label: string; color?: string }[] = [
  { role: 'paciente', label: 'Entrar como Paciente' },
  { role: 'medico', label: 'Entrar como Médico', color: '#4a5568' },
  { role: 'instituto', label: 'Entrar como Instituto', color: '#2b6cb0' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="checklist-wrapper">
      <div className="checklist-container">
        <h1 className="checklist-title">Acesso ao Sistema</h1>
        <p className="checklist-subtitle">Selecione o seu perfil para entrar (Mock).</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px', margin: '0 auto' }}>
          {ROLE_OPTIONS.map(({ role, label, color }) => (
            <button
              key={role}
              className="checklist-submit-btn"
              style={color ? { backgroundColor: color } : undefined}
              onClick={() => handleLogin(role)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '32px' }}>
          <button className="hero-btn-secondary" onClick={() => navigate('/')}>
            Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
