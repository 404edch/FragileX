import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import './Sidebar.css';

interface UserInfo {
  name: string;
  photo?: string;
}

interface SidebarProps {
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

// Structured menu to easily grant/revoke access based on role
const MENU_OPTIONS: MenuOption[] = [
  { id: 'patients', label: 'Lista de Pacientes', roles: ['medic', 'institute', 'admin'] },
  { id: 'register', label: 'Cadastrar Paciente', roles: ['medic', 'institute', 'admin'] },
  { id: 'reports', label: 'Relatórios', roles: ['institute', 'admin'] },
  { id: 'audit', label: 'Registro de Auditoria', roles: ['admin'] },
  { id: 'medRegistration', label: 'Cadastro de Médicos', roles: ['admin'] },
  { id: 'support', label: 'Suporte', roles: ['patient', 'medic'] },
];

const Sidebar = ({ role, user, setView, onLogout, isOpen, onClose }: SidebarProps) => {
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
        {/* Logged in User Profile Info */}
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
