import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './PatientList.css';
import { backendService, type MockUsuario, type MockPaciente } from '../../../services/backendService';
import { useAuth } from '../../../contexts/AuthContext';
import Fuse from 'fuse.js';

interface PatientListProps {
  role: string;
  onPatientClick?: (patient: any) => void;
}

const PatientList = ({ role, onPatientClick }: PatientListProps) => {
  const [patients, setPatients] = useState<(MockUsuario & { pacienteDetails?: MockPaciente })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSindrome, setFilterSindrome] = useState('');

  const { usuario } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!usuario) return;
      try {
        setLoading(true);
        let data: (MockUsuario & { pacienteDetails?: MockPaciente })[] = [];
        
        if (role === 'medico') {
          data = await backendService.listarPacientesDoMedico(usuario.id);
        } else {
          // Admin and Instituto see all patients
          data = await backendService.listarTodosPacientes();
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

    if (filterSindrome) {
      result = result.filter(p => p.pacienteDetails?.sindrome === filterSindrome);
    }

    return result;
  }, [searchTerm, filterStatus, filterSindrome, fuse, patients]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando lista de pacientes...</div>;
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>{role === 'medico' ? 'Meus Pacientes' : 'Todos os Pacientes'}</h2>
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
          value={filterSindrome} 
          onChange={(e) => setFilterSindrome(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
        >
          <option value="">Síndrome</option>
          <option value="normal">Normal</option>
          <option value="pre_mutacao">Pré-Mutação</option>
          <option value="mutacao">Mutação Completa</option>
        </select>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-patients-state" style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          Nenhum paciente encontrado.
        </div>
      ) : (
        <div className="patients-grid">
          <AnimatePresence>
            {filteredPatients.map((patient, index) => {
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
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                          <strong>CPF:</strong> {patient.cpf || 'Não informado'}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                          <strong>Nascimento:</strong> {patient.pacienteDetails?.data_nascimento ? new Date(patient.pacienteDetails.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ 
                      padding: '8px 16px', 
                      borderRadius: '999px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      background: patient.status === 'ACTIVE' ? '#dcfce7' : '#fef9c3',
                      color: patient.status === 'ACTIVE' ? '#166534' : '#854d0e',
                      border: `1px solid ${patient.status === 'ACTIVE' ? '#bbf7d0' : '#fef08a'}`
                    }}>
                      {patient.status === 'ACTIVE' ? 'Ativo' : 'Aguardando Ativação'}
                    </span>
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
      )}
    </div>
  );
};

export default PatientList;