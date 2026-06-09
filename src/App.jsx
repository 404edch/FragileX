import React, { useState } from 'react';
import EstilosGlobais from './components/EstilosGlobais';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuemSomos from './components/QuemSomos';
import Footer from './components/Footer';
// Import Medical Dashboard Components
import Sidebar from './components/Sidebar';
import PatientList from './screens/PatientList';
import PatientDetail from './screens/PatientDetail';
import AdminDashboard from './screens/AdminDashboard';
import ReportScreen from './screens/ReportScreen';
import PatientDashboard from './screens/PatientDashboard';

const ROLES = ['Admin', 'Medic', 'Patient'];

/**
 * Componente principal da aplicação
 * Sem autenticação — acesso direto ao dashboard para desenvolvimento.
 * Seletor de role com 3 botões para alternar a visão.
 */
export default function App() {
  const [dashboardAtivo, setDashboardAtivo] = useState(false);
  const [roleDashboard, setRoleDashboard] = useState('Admin');
  const [viewAtual, setViewAtual] = useState('Dashboard');

  const handleEntrar = () => {
    setDashboardAtivo(true);
    setViewAtual('Dashboard');
  };

  const handleLogout = () => {
    setDashboardAtivo(false);
    setViewAtual('Dashboard');
  };

  if (dashboardAtivo) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
        {/* Role switcher strip */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          fontSize: 13,
          color: '#94a3b8',
        }}>
          <span style={{ marginRight: 4, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11 }}>
            Dev · Role:
          </span>
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => { setRoleDashboard(role); setViewAtual('Dashboard'); }}
              style={{
                padding: '3px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                background: roleDashboard === role ? '#6366f1' : '#334155',
                color: roleDashboard === role ? '#fff' : '#94a3b8',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Main dashboard layout — offset for the dev strip */}
        <div style={{ display: 'flex', width: '100%', paddingTop: 36 }}>
          <Sidebar
            role={roleDashboard}
            onNavigate={setViewAtual}
            onLogout={handleLogout}
          />
          <div style={{ flex: 1 }}>
            {viewAtual === 'Dashboard' && (
              roleDashboard === 'Admin' || roleDashboard === 'Medic'
                ? <AdminDashboard />
                : <PatientDashboard />
            )}
            {viewAtual === 'List' && <PatientList />}
            {viewAtual === 'Detail' && <PatientDetail />}
            {viewAtual === 'Reports' && <ReportScreen />}
          </div>
        </div>
      </div>
    );
  }

  // Landing page — "Entrar" goes straight to dashboard
  return (
    <>
      <EstilosGlobais />
      <div style={{ minHeight: '100vh', width: '100%', background: '#fff' }}>
        <Navbar
          onLoginClick={handleEntrar}
          usuarioLogado={null}
          onLogout={handleLogout}
        />
        <main>
          <Hero />
          <QuemSomos />
        </main>
        <Footer />
      </div>
    </>
  );
}