import React from 'react';
import { motion } from 'motion/react';
import './AuditLog.css';

const AuditLog = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="audit-container">
      <h2 className="audit-title">Registro de Auditoria do Sistema</h2>
      <p className="audit-desc">Acompanhe todas as ações administrativas, médicas e de sistema.</p>
      <div className="audit-db-placeholder">
        [Integração BD: Filtros de Auditoria]
      </div>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Usuário / Função</th>
            <th>Ação</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="audit-table-empty">
              Os dados aparecerão aqui quando conectados ao endpoint da API de Auditoria.
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};

export default AuditLog;
