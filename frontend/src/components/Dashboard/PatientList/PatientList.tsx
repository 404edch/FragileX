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

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2 className="patient-list-title">{role === 'medic' ? 'Meus Pacientes' : 'Todos os Pacientes'}</h2>
        <div className="patient-list-controls">
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
