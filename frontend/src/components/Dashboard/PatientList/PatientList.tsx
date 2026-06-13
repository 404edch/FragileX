import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './PatientList.css';
import { doctorService } from '../../../services/doctorService';
import { patientService } from '../../../services/patientService';
import { MockUsuario, MockPaciente } from '../../../services/types';
import { useAuth } from '../../../contexts/AuthContext';
import Fuse from 'fuse.js';

const PATIENTS_PER_PAGE = 10;

interface PatientListProps {
  role: string;
  onPatientClick?: (patient: { id: number }) => void;
}

const PatientList = ({ role, onPatientClick }: PatientListProps) => {
  const [patients, setPatients] = useState<(MockUsuario & { pacienteDetails?: MockPaciente })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTriagem, setFilterTriagem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { usuario } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!usuario) return;
      try {
        setLoading(true);
        let data: (MockUsuario & { pacienteDetails?: MockPaciente })[] = [];
        
        if (role === 'medico') {
          data = await doctorService.listarPacientesDoMedico(usuario.id);
        } else {
          // Admin and Instituto see all patients
          data = await patientService.listarTodosPacientes();
        }
        
        setPatients(data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, [role, usuario]);

  const fuse = useMemo(() => new Fuse(patients, {
    keys: ['nome', 'cpf'],
    threshold: 0.3,
  }), [patients]);

  const filteredPatients = useMemo(() => {
    let result = patients;

    if (searchTerm) {
      result = fuse.search(searchTerm).map(r => r.item);
    }

    if (filterStatus) {
      result = result.filter(p => p.pacienteDetails?.encaminhamento_status === filterStatus);
    }

    if (filterTriagem) {
      if (filterTriagem === 'Não Avaliado') {
        result = result.filter(p => !p.pacienteDetails?.classificacao_oficial || p.pacienteDetails.classificacao_oficial === 'Não Avaliado');
      } else {
        result = result.filter(p => p.pacienteDetails?.classificacao_oficial === filterTriagem);
      }
    }

    return result;
  }, [searchTerm, filterStatus, filterTriagem, fuse, patients]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterTriagem]);

  const totalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + PATIENTS_PER_PAGE);

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando lista de pacientes...</div>;
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>
          {role === 'medico' ? 'Meus Pacientes' : 'Todos os Pacientes'}
        </h2>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Buscar por nome ou CPF..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '250px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
        >
          <option value="">Status de Encaminhamento</option>
          <option value="pendente">Pendente</option>
          <option value="encaminhado">Encaminhado</option>
          <option value="encaminhamento negado">Encaminhamento Negado</option>
        </select>
        <select 
          value={filterTriagem} 
          onChange={(e) => setFilterTriagem(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
        >
          <option value="">Resultado da Triagem (Todos)</option>
          <option value="Suspeito">Suspeito</option>
          <option value="Negativo">Normal (Negativo)</option>
          <option value="Não Avaliado">Não Avaliado</option>
        </select>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-patients-state" style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          Nenhum paciente encontrado.
        </div>
      ) : (
        <>
          {/* Patient count & page info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>
              Mostrando {startIndex + 1}–{Math.min(startIndex + PATIENTS_PER_PAGE, filteredPatients.length)} de {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="patients-grid">
            <AnimatePresence mode="wait">
              {paginatedPatients.map((patient, index) => {
                const semAcompanhamento = patient.pacienteDetails?.id_medico_responsavel === null;
                
                return (
                  <motion.div 
                    key={patient.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="patient-card" 
                    onClick={() => onPatientClick && onPatientClick({ id: patient.id })}
                    style={{ 
                      cursor: 'pointer', 
                      padding: '24px', 
                      borderRadius: '12px', 
                      background: '#fff', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                      marginBottom: '16px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      borderLeft: semAcompanhamento ? '6px solid #f43f5e' : '6px solid #10b981',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {patient.pacienteDetails?.foto_perfil ? (
                        <img 
                          src={patient.pacienteDetails.foto_perfil} 
                          alt="Foto" 
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                        />
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold' }}>
                          {patient.nome.charAt(0)}
                        </div>
                      )}
                      
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {patient.nome}
                          {semAcompanhamento && (
                            <span style={{ fontSize: '11px', background: '#ffe4e6', color: '#e11d48', padding: '4px 8px', borderRadius: '99px' }}>
                              Sem acompanhamento médico
                            </span>
                          )}
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                            <strong>CPF:</strong> {patient.cpf || 'Não informado'}
                          </p>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                            <strong>Nascimento:</strong> {patient.pacienteDetails?.data_nascimento ? new Date(patient.pacienteDetails.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                          </p>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                            <strong>Sexo Biológico:</strong> {patient.pacienteDetails?.sexo_biologico === 'M' ? 'Masculino' : patient.pacienteDetails?.sexo_biologico === 'F' ? 'Feminino' : 'Não informado'}
                          </p>
                          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                            <strong>Responsável Principal:</strong> {patient.pacienteDetails?.responsavel_nome || 'O próprio paciente'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '999px', 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          background: patient.status === 'ACTIVE' ? '#dcfce7' : '#fef9c3',
                          color: patient.status === 'ACTIVE' ? '#166534' : '#854d0e',
                          border: `1px solid ${patient.status === 'ACTIVE' ? '#bbf7d0' : '#fef08a'}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {patient.status === 'ACTIVE' ? 'Usuário Ativo' : 'Aguardando Ativação'}
                        </span>
                        
                        {patient.pacienteDetails?.encaminhamento_status && (
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: patient.pacienteDetails.encaminhamento_status === 'encaminhado' ? '#dcfce7' : 
                                        patient.pacienteDetails.encaminhamento_status === 'encaminhamento negado' ? '#fee2e2' : '#fef3c7',
                            color: patient.pacienteDetails.encaminhamento_status === 'encaminhado' ? '#166534' : 
                                   patient.pacienteDetails.encaminhamento_status === 'encaminhamento negado' ? '#991b1b' : '#92400e',
                            border: `1px solid ${
                                    patient.pacienteDetails.encaminhamento_status === 'encaminhado' ? '#bbf7d0' : 
                                    patient.pacienteDetails.encaminhamento_status === 'encaminhamento negado' ? '#fecaca' : '#fde68a'}`,
                            whiteSpace: 'nowrap'
                          }}>
                            {patient.pacienteDetails.encaminhamento_status === 'encaminhado' ? 'Encaminhado' : 
                             patient.pacienteDetails.encaminhamento_status === 'encaminhamento negado' ? 'Negado' : 'Pendente'}
                          </span>
                        )}
                      </div>
                      {patient.pacienteDetails?.classificacao_oficial && patient.pacienteDetails.classificacao_oficial !== 'Não Avaliado' && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: '#e0e7ff',
                          color: '#3730a3',
                          border: '1px solid #c7d2fe'
                        }}>
                          Oficial: {patient.pacienteDetails.classificacao_oficial}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginTop: '24px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#fff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.15s ease'
                }}
              >
                ← Anterior
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} style={{ padding: '8px 4px', color: '#94a3b8', fontSize: '14px', userSelect: 'none' }}>
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: currentPage === page ? '1px solid #6366f1' : '1px solid #cbd5e1',
                      background: currentPage === page ? '#6366f1' : '#fff',
                      color: currentPage === page ? '#fff' : '#334155',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: currentPage === page ? 700 : 500,
                      transition: 'all 0.15s ease',
                      minWidth: '40px'
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#fff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.15s ease'
                }}
              >
                Próximo →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientList;