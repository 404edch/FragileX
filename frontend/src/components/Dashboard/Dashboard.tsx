import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import PatientList from './PatientList/PatientList';
import { type Patient } from './types';
import './Dashboard.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DoctorApprovals from './DoctorApprovals';
import PatientDashboard from './PatientDashboard';
import EditLanding from './EditLanding';
import AdminMedics from './AdminMedics';
import AdminUsers from './AdminUsers';
import AuditLog from './AuditLog/AuditLog';

const NAVIGATION_VIEWS: Record<string, string> = {
  'register-patient': '/registro',
  'quick-checklist': '/checklist-rapido',
  'fill-checklist': '/preencher-checklist',
  'patient-fill-checklist': '/preencher-checklist',
};

const DEFAULT_VIEW: Record<string, string> = {
  instituto: 'all-patients',
  medico: 'my-patients',
  paciente: 'my-history',
  admin: 'audit-log',
};

const Dashboard = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    } else if (usuario.role) {
      setCurrentView(DEFAULT_VIEW[usuario.role] ?? '');
    }
  }, [usuario, navigate]);

  if (!usuario) return null;

  const handleSetView = (view: string) => {
    setIsSidebarOpen(false);

    if (view in NAVIGATION_VIEWS) {
      navigate(NAVIGATION_VIEWS[view]);
    } else {
      setCurrentView(view);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    window.open(`/patient/${patient.id}`, '_blank');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'all-patients':
      case 'my-patients':
        return <PatientList onPatientClick={handlePatientClick} role={usuario.role || 'paciente'} />;
      case 'all-doctors':
        return <div className="dashboard-db-placeholder">[MOCK: Lista de Médicos Parceiros]</div>;
      case 'approvals':
<<<<<<< HEAD
        return <DoctorApprovals />;
      case 'edit-landing':
        return <EditLanding />;
      case 'my-history':
        return <PatientDashboard idUsuario={usuario.id} />;
      case 'audit-log':
        return <AuditLog />;
      case 'manage-medics':
        return <AdminMedics />;
      case 'manage-users':
        return <AdminUsers />;
=======
        return <div className="dashboard-db-placeholder">[MOCK: Aprovações Pendentes de Médicos (Ação: Admin acessa adminRotas)]</div>;
      case 'my-history':
        return <div className="dashboard-db-placeholder">[MOCK: Histórico de Checklists do Paciente]</div>;
      case 'link-requests':
        return <div className="dashboard-db-placeholder">[MOCK: Solicitações de Vínculo do Médico aguardando Aprovação/Recusa do Paciente]</div>;
>>>>>>> a03e2149d4fc97779a2edce748d8db94df548ebf
      default:
        return <div className="dashboard-db-placeholder">Selecione uma opção no menu.</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        role={usuario.role || ''}
        user={{ name: usuario.nome }}
        setView={handleSetView}
        onLogout={() => { logout(); navigate('/'); }}
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
