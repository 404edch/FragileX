import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Patient } from '../types';
import { backendService } from '../../../services/backendService';
import './PatientCard.css';

interface PatientCardProps {
  patient: Patient;
  onClose: () => void;
  role: string;
}

const PatientCard = ({ patient, onClose, role }: PatientCardProps) => {
  const [status, setStatus] = useState(patient.encaminhamento_status || 'pendente');

  const handleWhatsAppRedirect = (phone?: string) => {
    if(phone) {
      const mensagem = encodeURIComponent("Olá, esta mensagem é do Instituto Buko Kaesemodel, estamos te contatando para falar sobre:");
      window.open(`https://wa.me/${phone}?text=${mensagem}`, '_blank');
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      await backendService.updatePatientStatus(Number(patient.id), newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
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
        <div className="patient-card-picture" style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {patient.foto_perfil && role !== 'paciente' ? (
            <img src={patient.foto_perfil} alt="Foto do paciente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '32px', color: '#64748b' }}>{patient.name?.charAt(0)}</span>
          )}
        </div>
        <div className="patient-card-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 className="patient-card-name">{patient.name || 'Nome do Paciente'}</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div className="patient-card-tag">
                  Tag Oficial: {patient.classificacao_oficial || 'Não Avaliado'}
                </div>
                <div className="patient-card-tag" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                  Acompanhamento: {patient.tag || 'Nenhuma'}
                </div>
              </div>
            </div>

            {(role === 'instituto' || role === 'admin') && (
              <div style={{ textAlign: 'right' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}>Status Instituto</label>
                <select 
                  value={status} 
                  onChange={handleStatusChange}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#f8fafc',
                    color: status === 'encaminhado' ? '#059669' : status === 'encaminhamento negado' ? '#e11d48' : '#ca8a04',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="encaminhado">Encaminhado</option>
                  <option value="encaminhamento negado">Encaminhamento Negado</option>
                </select>
              </div>
            )}
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
        <div className="patient-card-db-placeholder">
          <ul className="patient-card-history-list">
            <li><strong>15/01/2024</strong> - Checkup de Rotina - Notas: Paciente relatou dores de cabeça leves.</li>
            <li><strong>05/11/2023</strong> - Revisão de Exames de Sangue - Notas: Todos os níveis normais.</li>
          </ul>
        </div>
      </div>

      <div className="patient-card-section">
        <h3 className="patient-card-section-title">Requisição de Exames</h3>
        <div className="patient-card-db-placeholder">[Integração BD: Exames]</div>
      </div>

      <div className="patient-card-section">
        <h3 className="patient-card-section-title">Pacientes Relacionados</h3>
        <div className="patient-card-db-placeholder">[Integração BD: Pacientes Relacionados]</div>
      </div>

      {role === 'paciente' && (
        <div className="patient-card-support">
          <h3 className="patient-card-support-title">Cartão de Suporte</h3>
          <p className="patient-card-support-text">Precisa de ajuda? Entre em contato com nossa equipe de suporte.</p>
        </div>
      )}
    </motion.div>
  );
};

export default PatientCard;
