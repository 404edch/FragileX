import React, { useState } from 'react';
import AnimatedList from '../../Shared/AnimatedList';
import './PatientList.css';
import { api } from '../../../services/api';
import ChecklistModal from '../ChecklistModal/ChecklistModal';

interface PatientListProps {
  role: string;
}

const PatientList = ({ role }: PatientListProps) => {
  const [search, setSearch] = useState('');
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Modal state
  const [selectedChecklist, setSelectedChecklist] = useState<any | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get(`/checklists/search?search=${encodeURIComponent(search)}`);
      setChecklists(response.data);
    } catch (error) {
      console.error("Erro ao buscar checklists:", error);
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Busca de Checklists por Paciente</h2>
      </div>

      <div className="filters-panel" style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Digite o Nome ou CPF do paciente..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: '1', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s' }} 
          />
          <button 
            type="submit" 
            style={{ padding: '14px 28px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>
        </form>
      </div>

      {!hasSearched ? (
        <div className="no-patients-state" style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>🔍</span>
          Utilize a barra acima para pesquisar as últimas checklists preenchidas.
        </div>
      ) : checklists.length === 0 ? (
        <div className="no-patients-state" style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          Nenhuma checklist encontrada para esta busca.
        </div>
      ) : (
        <div className="patients-grid">
          <AnimatedList>
            {checklists.map((checklist) => (
              <div 
                key={checklist.id} 
                className="patient-card" 
                onClick={() => setSelectedChecklist(checklist)}
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
                  borderLeft: checklist.classificacao === 'Suspeito' ? '6px solid #ef4444' : '6px solid #10b981',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#0f172a', fontWeight: 700 }}>
                    {checklist.paciente_nome}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                      <strong>CPF:</strong> {checklist.paciente_cpf || 'Não informado'}
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                      <strong>Preenchido por:</strong> <span style={{ color: '#0f172a' }}>{checklist.preenchido_por}</span>
                    </p>
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🕒 {new Date(checklist.data_preenchimento).toLocaleDateString('pt-BR')} às {new Date(checklist.data_preenchimento).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
                    {checklist.score_final?.toFixed(2) || 'N/A'}
                  </div>
                  <span style={{ 
                    padding: '8px 16px', 
                    borderRadius: '999px', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    backgroundColor: checklist.classificacao === 'Suspeito' ? '#fef2f2' : '#f0fdf4', 
                    color: checklist.classificacao === 'Suspeito' ? '#ef4444' : '#10b981',
                    border: `1px solid ${checklist.classificacao === 'Suspeito' ? '#fecaca' : '#a7f3d0'}`
                  }}>
                    {checklist.classificacao === 'Suspeito' ? '⚠️ Suspeito' : '✓ Não Suspeito'}
                  </span>
                </div>
              </div>
            ))}
          </AnimatedList>
        </div>
      )}

      {selectedChecklist && (
        <ChecklistModal
          checklist={selectedChecklist}
          onClose={() => setSelectedChecklist(null)}
        />
      )}
    </div>
  );
};

export default PatientList;
