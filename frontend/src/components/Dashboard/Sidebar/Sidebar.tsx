import React from 'react';
import { motion } from 'motion/react';
import './Sidebar.css';

interface SidebarProps {
  role: string;
  setView: (view: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ role, setView, onLogout, isOpen, onClose }: SidebarProps) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header-mobile">
        <h2 className="sidebar-title">Menu</h2>
        {onClose && (
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Fechar Menu">
            &times;
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {['medic', 'institute', 'admin'].includes(role) && (
          <>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
              whileTap={{ scale: 0.98 }} 
              className="sidebar-btn" 
              onClick={() => setView('patients')}
            >
              Lista de Pacientes
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
              whileTap={{ scale: 0.98 }} 
              className="sidebar-btn" 
              onClick={() => setView('register')}
            >
              Cadastrar Paciente
            </motion.button>
          </>
        )}
        {['institute', 'admin'].includes(role) && (
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
            whileTap={{ scale: 0.98 }} 
            className="sidebar-btn" 
            onClick={() => setView('reports')}
          >
            Relatórios
          </motion.button>
        )}
        {role === 'admin' && (
          <>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
              whileTap={{ scale: 0.98 }} 
              className="sidebar-btn" 
              onClick={() => setView('audit')}
            >
              Registro de Auditoria
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
              whileTap={{ scale: 0.98 }} 
              className="sidebar-btn" 
              onClick={() => setView('medRegistration')}
            >
              Cadastro de Médicos
            </motion.button>
          </>
        )}
        {role === 'patient' && (
           <motion.button 
             whileHover={{ scale: 1.02, backgroundColor: 'rgba(26,95,168,0.1)' }} 
             whileTap={{ scale: 0.98 }} 
             className="sidebar-btn" 
             onClick={() => setView('support')}
           >
             Suporte
           </motion.button>
        )}
      </nav>
      <motion.button 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        onClick={onLogout} 
        className="sidebar-btn logout"
      >
        Sair
      </motion.button>
    </aside>
  );
};

export default Sidebar;
