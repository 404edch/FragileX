import React, { useState } from 'react';
import { linkService } from '../../services/linkService';
import { useAuth } from '../../contexts/AuthContext';

const ImportPatient = () => {
  const { usuario } = useAuth();
  const [cpf, setCpf] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    if (!cpf) {
      setStatusMsg({ text: 'Por favor, informe o CPF.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatusMsg({ text: '', type: '' });

    try {
      await linkService.importarPacientePorCpf(usuario.id, cpf);
      setStatusMsg({ text: 'Solicitação de vínculo enviada com sucesso! O paciente deve aprovar o vínculo no painel dele.', type: 'success' });
      setCpf('');
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({ text: 'Erro ao solicitar vínculo. Verifique se o CPF está correto, se o paciente existe ou se já há um vínculo pendente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-med-registration" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
      <h2 style={{ fontSize: '24px', color: '#1a3a6e', marginBottom: '16px', fontWeight: 'bold' }}>Importar Paciente</h2>
      <p style={{ color: '#475569', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
        Informe o CPF de um paciente que já possui conta no sistema. O paciente receberá uma notificação no painel dele e, ao aprovar, você terá acesso ao histórico clínico e checklists dele.
      </p>

      {statusMsg.text && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: statusMsg.type === 'success' ? '#166534' : '#b91c1c',
          border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          fontSize: '14px'
        }}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>CPF do Paciente</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Apenas números"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px',
            background: '#1a5fa8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Enviando...' : 'Solicitar Vínculo'}
        </button>
      </form>
    </div>
  );
};

export default ImportPatient;
