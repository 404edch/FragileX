import React, { useState } from 'react';
import EstilosGlobais from './components/Shared/EstilosGlobais';
import Navbar from './components/LandingPage/Navbar/Navbar';
import Hero from './components/LandingPage/Hero/Hero';
import QuemSomos from './components/LandingPage/QuemSomos/QuemSomos';
import Footer from './components/LandingPage/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';

/**
 * Componente principal da aplicação
 * Gerencia navegação entre landing page e dashboard
 */
export default function App() {
  const [dashboardAberto, setDashboardAberto] = useState(false);

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