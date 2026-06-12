import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../../../services/api';
import './AuditLog.css';

const AuditLog = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const carregarAudits = async () => {
      try {
        const data = await api.get('/audits');
        setLogs(data);
      } catch (error) {
        console.error("Erro ao obter logs de auditoria:", error);
      }
    };
    carregarAudits();
  }, []);

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      log.nome_usuario.toLowerCase().includes(q) ||
      log.role.toLowerCase().includes(q) ||
      log.acao.toLowerCase().includes(q) ||
      log.detalhes.toLowerCase().includes(q)
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="audit-container">
      <h2 className="audit-title">Registro de Auditoria do Sistema</h2>
      <p className="audit-desc">Acompanhe em tempo real todas as ações administrativas, médicas e de sistema.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar por usuário, perfil, ação ou detalhes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px',
            background: '#fff',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <table className="audit-table">
        <thead>
          <tr>
            <th style={{ width: '180px' }}>Data / Hora</th>
            <th style={{ width: '180px' }}>Usuário / Função</th>
            <th style={{ width: '150px' }}>Ação</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={4} className="audit-table-empty">
                Nenhum registro de auditoria encontrado.
              </td>
            </tr>
          ) : (
            filteredLogs.map(log => {
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              
              return (
                <tr key={log.id}>
                  <td style={{ fontSize: '13px', color: '#666' }}>{formattedDate}</td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{log.nome_usuario}</div>
                    <span style={{
                      background: log.role === 'admin' ? '#fef3c7' : log.role === 'medico' ? '#e0f2fe' : log.role === 'instituto' ? '#dcfce7' : '#f3f4f6',
                      color: log.role === 'admin' ? '#d97706' : log.role === 'medico' ? '#0284c7' : log.role === 'instituto' ? '#15803d' : '#4b5563',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {log.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500', color: '#1a5fa8' }}>{log.acao}</span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#444' }}>{log.detalhes}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AuditLog;
