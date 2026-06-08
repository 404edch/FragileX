import React from 'react';
import EstilosGlobais from './components/EstilosGlobais';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuemSomos from './components/QuemSomos';
import Footer from './components/Footer';

/**
 * Componente principal da aplicação
 */
export default function App() {
  return (
    <>
      <EstilosGlobais />
      <div style={{ minHeight: "100vh", width: "100%", background: "#fff" }}>
        <Navbar />
        <main>
          <Hero />
          <QuemSomos />
        </main>
        <Footer />
      </div>
    </>
  );
}
