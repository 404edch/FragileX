import React from 'react';
import { motion } from 'motion/react';
import { Patient } from '../types';
import './PatientCard.css';

interface PatientCardProps {
  patient: Patient;
  onClose: () => void;
  role: string;
}

const PatientCard = ({ patient, onClose, role }: PatientCardProps) => {
  const handleWhatsAppRedirect = (phone?: string) => {
    if(phone) {
      const mensagem = encodeURIComponent("Olá, esta mensagem é do Instituto Buko Kaesemodel, estamos te contatando para falar sobre:");
      window.open(`https://wa.me/${phone}?text=${mensagem}`, '_blank');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="patient-card-container">
      <motion.button 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        onClick={onClose} 
        className="patient-card-back-btn"
      >
        ← Fechar Aba
      </motion.button>
      
      <div className="patient-card-header">
        <div className="patient-card-picture">
           [Foto BD]
        </div>
        <div className="patient-card-info">
          <h2 className="patient-card-name">{patient.name || 'Nome do Paciente'}</h2>
          <div className="patient-card-tag">
            Tag: {patient.tag || 'Nenhuma'}
          </div>
          <p className="patient-card-responsible"><strong>Responsável:</strong> {patient.responsibleFigure || 'N/A'}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWhatsAppRedirect(patient?.phone)}
            className="patient-card-whatsapp-btn"
          >
            Contato via WhatsApp
          </motion.button>
        </div>
      </div>

      <hr className="patient-card-divider" />

      {/* Histórico de Consultas */}
      <div className="patient-card-section">
        <h3 className="patient-card-section-title">Histórico de Consultas</h3>
        
        {/* 🚨 MOCK DATA: Delete this div when integrating with your DB 🚨 */}
        <div className="patient-card-db-placeholder">
          <ul className="patient-card-history-list">
            <li><strong>15/01/2024</strong> - Checkup de Rotina - Notas: Paciente relatou dores de cabeça leves.</li>
            <li><strong>05/11/2023</strong> - Revisão de Exames de Sangue - Notas: Todos os níveis normais.</li>
            <li><strong>01/09/2023</strong> - Consulta Inicial - Notas: Perfil criado e métricas base registradas.</li>
          </ul>
        </div>
        {/* 🚨 END MOCK DATA 🚨 */}

        {/* Remover comentário quando integrar com DB real:
        <div className="patient-card-db-placeholder">
          [Integração BD: Histórico de Consultas]
        </div> 
        */}
      </div>

      <div className="patient-card-section">
        <h3 className="patient-card-section-title">Requisição de Exames</h3>
        <div className="patient-card-db-placeholder">[Integração BD: Exames]</div>
      </div>

      <div className="patient-card-section">
        <h3 className="patient-card-section-title">Pacientes Relacionados</h3>
        <div className="patient-card-db-placeholder">[Integração BD: Pacientes Relacionados]</div>
      </div>

      {role === 'patient' && (
        <div className="patient-card-support">
          <h3 className="patient-card-support-title">Cartão de Suporte</h3>
          <p className="patient-card-support-text">Precisa de ajuda? Entre em contato com nossa equipe de suporte.</p>
        </div>
      )}
    </motion.div>
  );
};

export default PatientCard;
