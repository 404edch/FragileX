import React, { useState } from 'react';
import EstilosGlobais from './components/Shared/EstilosGlobais';
import Navbar from './components/LandingPage/Navbar/Navbar';
import Hero from './components/LandingPage/Hero/Hero';
import QuemSomos from './components/LandingPage/QuemSomos/QuemSomos';
import Footer from './components/LandingPage/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import PatientCard from './components/Dashboard/PatientCard/PatientCard';
import { MOCK_PATIENTS_DATA } from './components/Dashboard/mockData';

/**
 * Componente principal da aplicação
 * Gerencia navegação entre landing page e dashboard
 */
export default function App() {
  const [dashboardAberto, setDashboardAberto] = useState(false);

  // Check if we need to render the isolated patient card
  const queryParams = new URLSearchParams(window.location.search);
  const patientIdParam = queryParams.get('patientId');

  if (patientIdParam) {
    const patientId = isNaN(Number(patientIdParam)) ? patientIdParam : Number(patientIdParam);
    const patient = MOCK_PATIENTS_DATA.find(p => p.id === patientId);
    
    if (patient) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <EstilosGlobais />
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <PatientCard patient={patient} onClose={() => window.close()} role="patient" />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ padding: 20, textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Paciente não encontrado.</h2>
        </div>
      );
    }
  }

  if (dashboardAberto) {
    return (
      <>
        <EstilosGlobais />
        <Dashboard onLogout={() => setDashboardAberto(false)} />
      </>
    );
  }

  return (
    <>
      <EstilosGlobais />
      <div style={{ minHeight: '100vh', width: '100%', background: '#fff' }}>
        <Navbar
          onLoginClick={() => setDashboardAberto(true)}
          usuarioLogado={undefined}
          onLogout={() => {}}
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