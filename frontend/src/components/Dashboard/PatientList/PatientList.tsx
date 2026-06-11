import React, { useState } from 'react';
import AnimatedList from '../../Shared/AnimatedList';
import { Patient } from '../types';
import './PatientList.css';

import { MOCK_PATIENTS_DATA } from '../mockData';

interface PatientListProps {
  onPatientClick: (patient: Patient) => void;
  role: string;
}

const PatientList = ({ onPatientClick, role }: PatientListProps) => {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS_DATA);

  const animatedItems = patients.map((patient) => ({
    ...patient,
    render: (
      <div className="patient-list-item">
        <div>
          <h3 className="patient-list-name">{patient.name}</h3>
          <p className="patient-list-details">
            Idade: {patient.age} | Sexo: {patient.sex} | Última Consulta: {patient.lastConsultation}
          </p>
        </div>
        {patient.tag && (
          <span 
            className="patient-list-tag" 
            style={{ background: patient.tag === 'Urgente' ? '#ff4d4f' : '#1a5fa8' }}
          >
            {patient.tag}
          </span>
        )}
      </div>
    )
  }));

  const [showImportModal, setShowImportModal] = useState(false);
  const [importCpf, setImportCpf] = useState('');
  const [importMessage, setImportMessage] = useState('');

  const handleImportPatient = async () => {
    try {
      console.log('Simulando solicitação de vínculo no Supabase para CPF:', importCpf);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImportMessage('Solicitação de vínculo enviada com sucesso!');
    } catch (e) {
      setImportMessage('Erro de conexão.');
    }
  };

  return (
    <div className="patient-list-container">
      {showImportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h3>Importar Paciente Existente</h3>
            <p>Digite o CPF do paciente para solicitar vínculo.</p>
            <input type="text" value={importCpf} onChange={e => setImportCpf(e.target.value)} placeholder="000.000.000-00" style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
            {importMessage && <p style={{ color: importMessage.includes('Erro') ? 'red' : 'green' }}>{importMessage}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowImportModal(false)}>Fechar</button>
              <button onClick={handleImportPatient} style={{ background: '#1a5fa8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Solicitar</button>
            </div>
          </div>
        </div>
      )}

      <div className="patient-list-header">
        <h2 className="patient-list-title">{role === 'medico' ? 'Meus Pacientes' : 'Todos os Pacientes'}</h2>
        <div className="patient-list-controls">
          {role === 'medico' && (
            <button onClick={() => setShowImportModal(true)} style={{ background: '#1a5fa8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
              Importar Paciente
            </button>
          )}
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className="patient-search-input"
          />
          <button className="patient-filter-btn" aria-label="Filtros" title="Filtrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
      </div>
      <AnimatedList 
        items={animatedItems} 
        onItemSelect={(item) => onPatientClick(item as Patient)} 
        className="patient-animated-list"
        displayScrollbar={false}
      />
    </div>
  );
};

export default PatientList;
