import React, { useState } from 'react';
import { motion } from 'motion/react';
import Sidebar from './Sidebar/Sidebar';
import PatientList from './PatientList/PatientList';
import PatientCard from './PatientCard/PatientCard';
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
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const renderContent = () => {
    if (selectedPatient) {
      return <PatientCard patient={selectedPatient} onClose={() => setSelectedPatient(null)} role={userRole} />;
    }

    switch (currentView) {
      case 'patients':
        return <PatientList onPatientClick={setSelectedPatient} role={userRole} />;
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
        return <PatientList onPatientClick={setSelectedPatient} role={userRole} />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar 
        role={userRole} 
        setView={(view) => { setCurrentView(view); setSelectedPatient(null); }}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <div className="dashboard-content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
