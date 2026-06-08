import React, { useState } from 'react';
import EstilosGlobais from './components/EstilosGlobais';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuemSomos from './components/QuemSomos';
import Footer from './components/Footer';
import Login from './components/Login';

/**
 * Componente principal da aplicação
 * Gerencia estado global de autenticação e exibição do modal de login
 */
export default function App() {
  // Estado da exibição do login
  const [loginAberto, setLoginAberto] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Manipulador de login bem-sucedido
  const handleLoginSucesso = (dados) => {
    setUsuarioLogado(dados);
    console.log('Login realizado:', dados.email);
  };

  return (
    <>
      <EstilosGlobais />
      <div style={{ minHeight: "100vh", width: "100%", background: "#fff" }}>
        <Navbar 
          onLoginClick={() => setLoginAberto(true)}
          usuarioLogado={usuarioLogado}
          onLogout={() => setUsuarioLogado(null)}
        />
        <main>
          <Hero />
          <QuemSomos />
        </main>
        <Footer />
      </div>

      {/* Modal de Login */}
      {loginAberto && (
        <Login 
          onClose={() => setLoginAberto(false)}
          onLoginSuccess={handleLoginSucesso}
        />
      )}
    </>
  );
}
