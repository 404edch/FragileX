import React from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import EstilosGlobais from './components/Shared/EstilosGlobais';
import Navbar from './components/LandingPage/Navbar/Navbar';
import Hero from './components/LandingPage/Hero/Hero';
import QuemSomos from './components/LandingPage/QuemSomos/QuemSomos';
import Footer from './components/LandingPage/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import PatientCard from './components/Dashboard/PatientCard/PatientCard';
import { MOCK_PATIENTS_DATA } from './components/Dashboard/mockData';
import Checklist from './components/Checklist/Checklist';

const PatientCardRouteWrapper = () => {
  const { id } = useParams();
  const patientId = id ? (isNaN(Number(id)) ? id : Number(id)) : null;
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
};

const LandingPageLayout = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#fff' }}>
      <Navbar
        onLoginClick={() => navigate('/dashboard')}
        usuarioLogado={undefined}
        onLogout={() => {}}
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
  const navigate = useNavigate();
  return (
    <>
      <EstilosGlobais />
      <Routes>
        <Route path="/" element={<LandingPageLayout />} />
        <Route path="/dashboard" element={<Dashboard onLogout={() => navigate('/')} />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/patient/:id" element={<PatientCardRouteWrapper />} />
      </Routes>
    </>
  );
}