import React, { useState } from 'react';
import EstilosGlobais from './components/EstilosGlobais';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuemSomos from './components/QuemSomos';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

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
          usuarioLogado={null}
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