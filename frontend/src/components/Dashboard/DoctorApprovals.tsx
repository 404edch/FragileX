import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Dashboard.css';

interface Solicitacao {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
  instituicao: string;
  status: string;
  data_criacao: string;
  motivo_recusa?: string;
}

const DoctorApprovals = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [rejectionId, setRejectionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activationModalLink, setActivationModalLink] = useState<string | null>(null);

  const carregarSolicitacoes = async () => {
    try {
      const data = await api.get<Solicitacao[]>('/doctors/solicitacoes');
      setSolicitacoes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/doctors/solicitacoes/${id}/responder`, { aprovar: true });
      await carregarSolicitacoes();
      alert('Médico aprovado com sucesso! Pode acessar o sistema com as credenciais informadas.');
    } catch (e: any) {
      alert(e.message || 'Erro ao aprovar solicitação.');
    }
  };

  const startReject = (id: number) => {
    setRejectionId(id);
    setRejectionReason('');
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionId !== null) {
      try {
        await api.post(`/doctors/solicitacoes/${rejectionId}/responder`, { aprovar: false, motivoRecusa: rejectionReason });
        setRejectionId(null);
        setRejectionReason('');
        await carregarSolicitacoes();
        alert('Solicitação de médico rejeitada.');
      } catch (e: any) {
        alert(e.message || 'Erro ao rejeitar solicitação.');
      }
    }
  };

  const pendingList = solicitacoes.filter(s => s.status === 'PENDING');
  const pastList = solicitacoes.filter(s => s.status !== 'PENDING');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Modal de Link de Ativação Gerado (Simulando Envio) */}
      {activationModalLink && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="dashboard-med-registration" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }}>✓</div>
            <h3 className="dashboard-med-title" style={{ fontSize: '20px' }}>Médico Credenciado com Sucesso!</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Uma conta foi criada com status <strong>PENDING_ACTIVATION</strong>.
              O link de ativação abaixo foi enviado ao e-mail profissional cadastrado.
            </p>
            <div style={{
              background: '#f1f5f9',
              padding: '12px',
              borderRadius: '8px',
              border: '1px dashed #cbd5e1',
              fontSize: '12px',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              color: '#334155',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              {activationModalLink}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="checklist-submit-btn"
                style={{ flex: 1, margin: 0 }}
                onClick={() => window.open(activationModalLink, '_blank')}
              >
                Simular Ativação (Nova Guia)
              </button>
              <button
                type="button"
                className="hero-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setActivationModalLink(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Motivo de Rejeição */}
      {rejectionId !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <form onSubmit={handleRejectSubmit} className="dashboard-med-registration" style={{ maxWidth: '450px', width: '100%' }}>
            <h3 className="dashboard-med-title" style={{ color: '#ff4d4f' }}>Rejeitar Credenciamento</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Por favor, insira o motivo da rejeição da solicitação deste médico (opcional):
            </p>
            <div className="cadastro-item" style={{ width: '100%', marginBottom: '20px' }}>
              <label className="cadastro-label">Motivo do Indeferimento</label>
              <textarea
                className="cadastro-input"
                style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                placeholder="Ex: CRM inválido ou não ativo no CFM."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                className="checklist-submit-btn"
                style={{ flex: 1, background: '#ff4d4f', border: 'none', margin: 0 }}
              >
                Confirmar Rejeição
              </button>
              <button
                type="button"
                className="hero-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setRejectionId(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Título Principal */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5fa8', marginBottom: '10px' }}>
          Solicitações de Credenciamento
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
          Gerencie e aprove o credenciamento de novos médicos parceiros do Instituto.
        </p>
      </div>

      {/* Solicitações Pendentes */}
      <div className="dashboard-med-registration">
        <h3 style={{ fontSize: '18px', color: '#1a3a6e', marginBottom: '16px', fontWeight: 'bold' }}>
          Aprovações Pendentes ({pendingList.length})
        </h3>

        {pendingList.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic' }}>
            Nenhuma solicitação pendente no momento.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingList.map(sol => (
              <div
                key={sol.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: 'bold' }}>
                      {sol.nome}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      CRM: {sol.crm} | Especialidade: {sol.especialidade}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    background: '#fef3c7',
                    color: '#d97706',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    alignSelf: 'flex-start'
                  }}>
                    Aguardando Análise
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#475569',
                  borderTop: '1px solid #e2e8f0',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '8px 0'
                }}>
                  <div><strong>E-mail:</strong> {sol.email}</div>
                  <div><strong>Telefone:</strong> {sol.telefone}</div>
                  <div><strong>Cidade/UF:</strong> {sol.cidade} - {sol.estado}</div>
                  <div><strong>Instituição:</strong> {sol.instituicao}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleApprove(sol.id)}
                    className="checklist-submit-btn"
                    style={{ margin: 0, background: '#22c55e', color: 'white', padding: '8px 16px', fontSize: '13px' }}
                  >
                    Aprovar Médico
                  </button>
                  <button
                    type="button"
                    onClick={() => startReject(sol.id)}
                    className="checklist-submit-btn"
                    style={{ margin: 0, background: '#ef4444', color: 'white', padding: '8px 16px', fontSize: '13px' }}
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Histórico de Solicitações (Aprovadas/Rejeitadas) */}
      <div className="dashboard-med-registration">
        <h3 style={{ fontSize: '18px', color: '#1a3a6e', marginBottom: '16px', fontWeight: 'bold' }}>
          Histórico de Decisões
        </h3>

        {pastList.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px', fontStyle: 'italic' }}>
            Nenhum registro anterior de credenciamento.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pastList.map(sol => (
              <div
                key={sol.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: '#475569', fontSize: '14px', fontWeight: 'bold' }}>
                    {sol.nome} (CRM: {sol.crm})
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                    {sol.especialidade} | {sol.cidade} - {sol.estado}
                  </p>
                  {sol.status === 'REJECTED' && (
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#ef4444', fontStyle: 'italic' }}>
                      Motivo: {sol.motivo_recusa}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: '11px',
                  background: sol.status === 'APPROVED' ? '#dcfce7' : '#fee2e2',
                  color: sol.status === 'APPROVED' ? '#166534' : '#991b1b',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  fontWeight: 'bold'
                }}>
                  {sol.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorApprovals;
