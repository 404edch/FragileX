import React from 'react';
import './ChecklistModal.css';

interface ChecklistModalProps {
  checklist: Record<string, string | number | string[] | undefined | unknown>;
  onClose: () => void;
}

const ChecklistModal = ({ checklist, onClose }: ChecklistModalProps) => {
  return (
    <div className="checklist-modal-overlay" onClick={onClose}>
      <div className="checklist-modal-content" onClick={e => e.stopPropagation()}>
        <div className="checklist-modal-header">
          <h2>Detalhes do Checklist</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="checklist-modal-body">
          <div className="info-group">
            <p><strong>Paciente:</strong> {checklist.nome_paciente || checklist.paciente_nome}</p>
            <p><strong>CPF:</strong> {checklist.paciente_cpf || 'Não informado'}</p>
            <p><strong>Preenchido por:</strong> {checklist.preenchido_por}</p>
            <p><strong>Data:</strong> {new Date(checklist.data_preenchimento).toLocaleString('pt-BR')}</p>
            <p><strong>Classificação:</strong> <span style={{ color: checklist.classificacao === 'Suspeito' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{checklist.classificacao === 'Suspeito' ? 'Suspeito' : 'Não Suspeito'}</span></p>
            <p><strong>Score Final:</strong> {checklist.score_final?.toFixed(2)}</p>
          </div>

          <div className="symptoms-group">
            <h3>Sintomas Assinalados:</h3>
            {checklist.sintomas_nomes && checklist.sintomas_nomes.length > 0 ? (
              <ul className="symptoms-list">
                {checklist.sintomas_nomes.map((sintoma: string, idx: number) => (
                  <li key={idx}>✓ {sintoma}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum sintoma foi assinalado neste checklist.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;
