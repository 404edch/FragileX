import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Patient } from '../types';
import { userService } from '../../../services/userService';
import { patientService } from '../../../services/patientService';
import './PatientCard.css';

interface PatientCardProps {
  patient: Patient;
  onClose: () => void;
  role: string;
}

const PatientCard = ({ patient, onClose, role }: PatientCardProps) => {
  const [status, setStatus] = useState(patient.encaminhamento_status || 'pendente');
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [fotoLocal, setFotoLocal] = useState(patient.foto_perfil);

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsUploadingFoto(true);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await patientService.atualizarFotoPerfil(Number(patient.id), base64);
        setFotoLocal(base64);
      } catch {
        alert("Erro ao enviar foto");
      } finally {
        setIsUploadingFoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWhatsAppRedirect = (phone?: string) => {
    if(phone) {
      const mensagem = encodeURIComponent("Olá, esta mensagem é do Instituto Buko Kaesemodel, estamos te contatando para falar sobre:");
      window.open(`https://wa.me/${phone}?text=${mensagem}`, '_blank');
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      await patientService.updatePatientStatus(Number(patient.id), newStatus);
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="patient-card-picture" style={{ width: '180px', height: '180px', padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #1a5fa8', borderRadius: '10px' }}>
            {fotoLocal ? (
              <img src={fotoLocal} alt="Foto do paciente" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '32px', color: '#64748b' }}>{patient.name?.charAt(0)}</span>
            )}
          </div>
          <div style={{ marginTop: "10px" }}>
            <label style={{ cursor: "pointer", color: "#1a5fa8", fontSize: "13px", fontWeight: "bold", textDecoration: "underline" }}>
              {isUploadingFoto ? "Enviando..." : (fotoLocal ? "Trocar Foto" : "+ Adicionar Foto")}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadFoto} disabled={isUploadingFoto} />
            </label>
          </div>
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
          <h3 className="patient-card-support-title">Suporte e Contatos Úteis</h3>
          <p className="patient-card-support-text" style={{ marginBottom: "16px", color: "#475569" }}>
            O Programa de Ajuda do Instituto Buko Kaesemodel oferece acolhimento e orientações sobre a Síndrome do X Frágil.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              className="patient-card-whatsapp-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                background: "#25D366",
                border: "none",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => window.open("https://wa.me/5541991034847?text=Olá,%20gostaria%20de%20suporte%20sobre%20o%20Programa%20X%20Frágil", "_blank")}
            >
              Falar no WhatsApp Suporte
            </button>
            <div style={{ fontSize: "12px", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
              <div>
                📞 <strong>Fixo:</strong> <a href="tel:+554131560309" style={{ color: "#1a5fa8", textDecoration: "none" }}>(41) 3156-0309</a>
              </div>
              <div>
                ✉ <strong>E-mail:</strong> <a href="mailto:contato@institutobk.org.br" style={{ color: "#1a5fa8", textDecoration: "none" }}>contato@institutobk.org.br</a>
              </div>
              <div>
                📍 <strong>Endereço:</strong> <a href="https://maps.app.goo.gl/FDVXQcNtnsnnVAH98" target="_blank" rel="noreferrer" style={{ color: "#1a5fa8", textDecoration: "none" }}>Rua Fernando Simas, 172 – Curitiba-PR</a>
              </div>
              <div>
                🌐 <strong>Guia Síndrome X Frágil:</strong> <a href="https://eudigox.com.br/" target="_blank" rel="noreferrer" style={{ color: "#1a5fa8", textDecoration: "none" }}>Acesse o Portal</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientCard;
