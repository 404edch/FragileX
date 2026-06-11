import { Routes, Route, useNavigate } from 'react-router-dom';
import EstilosGlobais from './components/Shared/EstilosGlobais';
import Navbar from './components/LandingPage/Navbar/Navbar';
import Hero from './components/LandingPage/Hero/Hero';
import QuemSomos from './components/LandingPage/QuemSomos/QuemSomos';
import Footer from './components/LandingPage/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import PatientCardPage from './components/Dashboard/PatientCardPage';
import RegistroPaciente from './components/Checklist/RegistroPaciente';
import PreencherChecklist from './components/Checklist/PreencherChecklist';
import Login from './components/LandingPage/Login/Login';
import AplicacaoMedico from './components/LandingPage/AplicacaoMedico/AplicacaoMedico';
<<<<<<< HEAD
import ActivateAccount from './components/Dashboard/ActivateAccount';
=======
import AtivacaoConta from './components/AtivacaoConta/AtivacaoConta';
>>>>>>> a03e2149d4fc97779a2edce748d8db94df548ebf
import { AuthProvider, useAuth } from './contexts/AuthContext';

const LandingPageLayout = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#fff' }}>
      <Navbar
        onLoginClick={() => usuario ? navigate('/dashboard') : navigate('/login')}
        usuarioLogado={usuario || undefined}
        onLogout={logout}
      />
      <main>
        <Hero />
        <QuemSomos />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<LandingPageLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate-account" element={<ActivateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/registro" element={<RegistroPaciente />} />
        <Route path="/preencher-checklist" element={<PreencherChecklist />} />
        <Route path="/checklist-rapido" element={<PreencherChecklist isRapido />} />
        
        <Route path="/activate-account" element={<AtivacaoConta />} />

        <Route path="/aplicacao-medico" element={<AplicacaoMedico />} />

        <Route path="/patient/:id" element={<PatientCardPage />} />
      </Routes>
    </AuthProvider>
  );
}