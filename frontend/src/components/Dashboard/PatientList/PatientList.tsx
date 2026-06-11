import React, { useState, useEffect } from 'react';
import AnimatedList from '../../Shared/AnimatedList';
import { Patient } from '../types';
import './PatientList.css';
import { mockDbService } from '../../../services/mockDbService';
import { useAuth } from '../../../contexts/AuthContext';

interface PatientListProps {
  onPatientClick: (patient: Patient) => void;
  role: string;
}

const PatientList = ({ onPatientClick, role }: PatientListProps) => {
  const { usuario } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cpfToLink, setCpfToLink] = useState('');
  const [linkMessage, setLinkMessage] = useState<{ text: string; success: boolean } | null>(null);

  const calculateAge = (dob: string) => {
    try {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch {
      return 0;
    }
  };

  const carregarPacientes = async () => {
    if (!usuario) return;

    try {
      let listRaw = [];
      if (role === 'medico') {
        listRaw = await mockDbService.listarPacientesDoMedico(usuario.id);
      } else {
        listRaw = await mockDbService.listarTodosPacientes();
      }

      const mapped = listRaw.map(u => {
        const p = u.pacienteDetails;
        return {
          id: u.id,
          name: u.nome,
          age: p ? calculateAge(p.data_nascimento) : 0,
          sex: p ? p.sexo_biologico : 'M',
          lastConsultation: p?.id_medico_responsavel ? '2026-05-15' : 'Sem consulta vinculada',
          tag: p?.id_medico_responsavel ? 'Acompanhamento' : 'Sem Médico',
          responsibleFigure: p ? p.responsavel_nome : '',
          phone: p ? p.whatsapp || u.telefone || '' : ''
        };
      });

      setPatients(mapped);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, [usuario, role]);

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkMessage(null);

    if (!cpfToLink) {
      setLinkMessage({ text: 'Por favor, digite o CPF.', success: false });
      return;
    }

    if (!usuario) return;

    try {
      await mockDbService.importarPacientePorCpf(usuario.id, cpfToLink);
      setLinkMessage({ text: 'Solicitação de vínculo criada com sucesso! O paciente receberá um alerta para aprovar.', success: true });
      setCpfToLink('');
      await carregarPacientes();
    } catch (error: any) {
      setLinkMessage({ text: error.message || 'Erro ao vincular paciente.', success: false });
    }
  };

  // Filtrar pacientes
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const animatedItems = filteredPatients.map((patient) => ({
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
            style={{ background: patient.tag === 'Sem Médico' ? '#ff4d4f' : '#1a5fa8' }}
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
<<<<<<< HEAD
    <div className="patient-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Formulário de Vínculo via CPF para Médicos */}
      {role === 'medico' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(26,95,168,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', color: '#1a3a6e', fontWeight: 'bold', marginBottom: '4px' }}>
            Vincular Paciente Existente via CPF
          </h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '14px' }}>
            Informe o CPF do paciente para solicitar o compartilhamento do prontuário e acompanhamento.
          </p>

          {linkMessage && (
            <div style={{
              background: linkMessage.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${linkMessage.success ? '#22c55e' : '#ef4444'}`,
              color: linkMessage.success ? '#166534' : '#991b1b',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '12px'
            }}>
              {linkMessage.text}
            </div>
          )}

          <form onSubmit={handleLinkSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="cadastro-input"
              style={{ flex: 1, margin: 0, padding: '10px 14px', fontSize: '13px' }}
              placeholder="Digite o CPF do Paciente (ex: 111.222.333-44)"
              value={cpfToLink}
              onChange={(e) => setCpfToLink(e.target.value)}
            />
            <button
              type="submit"
              className="checklist-submit-btn"
              style={{ margin: 0, padding: '10px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              Solicitar Acesso
            </button>
          </form>
=======
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
>>>>>>> a03e2149d4fc97779a2edce748d8db94df548ebf
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(26,95,168,0.1)'
      }}>
        <div className="patient-list-header" style={{ marginBottom: '16px' }}>
          <h2 className="patient-list-title" style={{ fontSize: '18px', color: '#1a3a6e', fontWeight: 'bold' }}>
            {role === 'medico' ? 'Meus Pacientes Acompanhados' : 'Todos os Pacientes Cadastrados'}
          </h2>
          <div className="patient-list-controls">
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="patient-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {animatedItems.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            Nenhum paciente encontrado.
          </p>
        ) : (
          <AnimatedList 
            items={animatedItems} 
            onItemSelect={(item) => onPatientClick(item as Patient)} 
            className="patient-animated-list"
            displayScrollbar={false}
          />
        )}
      </div>
    </div>
  );
};

export default PatientList;
