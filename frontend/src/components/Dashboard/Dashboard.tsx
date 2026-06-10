import React, { useState } from 'react';
import { motion } from 'motion/react';
import Sidebar from './Sidebar/Sidebar';
import PatientList from './PatientList/PatientList';
import PatientForm from './PatientForm/PatientForm';
import Reports from './Reports/Reports';
import AuditLog from './AuditLog/AuditLog';
import { Patient } from './types';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [userRole] = useState('admin'); 
  const [currentView, setCurrentView] = useState('patients'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePatientClick = (patient: Patient) => {
    window.open(`/patient/${patient.id}`, '_blank');
  };

  const renderContent = () => {

    switch (currentView) {
      case 'patients':
        return <PatientList onPatientClick={handlePatientClick} role={userRole} />;
      case 'register':
        return <PatientForm onCancel={() => setCurrentView('patients')} role={userRole} />;
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditLog />;
      case 'medRegistration':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-med-registration">
            <h2 className="dashboard-med-title">Cadastro de Médicos</h2>
            <div className="dashboard-db-placeholder">
              [Integração BD: Formulário de Cadastro de Médicos]
            </div>
          </motion.div>
        );
      default:
        return <PatientList onPatientClick={handlePatientClick} role={userRole} />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        role={userRole} 
        user={{ name: 'Dr. Roberto Alves', photo: 'https://i.pravatar.cc/150?img=11' }}
        setView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="dashboard-main">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Abrir Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="dashboard-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
