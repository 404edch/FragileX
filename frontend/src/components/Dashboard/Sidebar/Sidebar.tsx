import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface UserInfo {
  name: string;
  photo?: string;
}

interface Props {
  role: string;
  user?: UserInfo;
  setView: (view: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type MenuOption = {
  id: string;
  label: string;
  roles: string[];
};

const MENU_OPTIONS: MenuOption[] = [
  // Instituto
  { id: 'all-patients', label: 'Todos os Pacientes', roles: ['instituto'] },
  { id: 'all-doctors', label: 'Médicos Cadastrados', roles: ['instituto'] },
  { id: 'approvals', label: 'Aprovações Pendentes', roles: ['instituto'] },

  // Medico
  { id: 'my-patients', label: 'Meus Pacientes', roles: ['medico'] },
  { id: 'register-patient', label: 'Cadastrar Paciente', roles: ['medico', 'instituto'] },
  { id: 'quick-checklist', label: 'Checklist Rápido', roles: ['medico'] },
  { id: 'fill-checklist', label: 'Preencher Checklist', roles: ['medico'] },

  // Paciente
  { id: 'patient-fill-checklist', label: 'Novo Checklist', roles: ['paciente'] },
  { id: 'my-history', label: 'Meu Histórico', roles: ['paciente'] },
  { id: 'link-requests', label: 'Solicitações de Vínculo', roles: ['paciente'] },
];

const Sidebar = ({ role, user, setView, onLogout, isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const allowedOptions = MENU_OPTIONS.filter(option => option.roles.includes(role));

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header-mobile">
        <div className="sidebar-menu-title-container">
          <h2 className="sidebar-menu-title">MENU</h2>
        </div>
        {onClose && (
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar Menu">
            &times;
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-role-group">
          {allowedOptions.map(option => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02, backgroundColor: 'var(--hover-bg, rgba(26,95,168,0.1))' }}
              whileTap={{ scale: 0.98 }}
              className="sidebar-btn"
              onClick={() => setView(option.id)}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </nav>

      <div className="sidebar-main-logo-container">
        <img src="/ibkblue.png.webp" alt="IBK Logo" className="sidebar-main-logo" />
      </div>

      <div className="sidebar-bottom-group">
        {user && (
          <div className="sidebar-user-profile">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="sidebar-user-avatar" />
            ) : (
              <div className="sidebar-user-avatar-fallback">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="sidebar-user-name">{user.name}</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="sidebar-btn"
          style={{ marginBottom: '8px' }}
        >
          Início
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="sidebar-btn logout"
        >
          Sair
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
