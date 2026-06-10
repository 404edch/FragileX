import React from 'react';
import { motion } from 'motion/react';
import './Reports.css';

const Reports = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="reports-container">
      <h2 className="reports-title">Relatórios do Sistema</h2>
      <div className="reports-db-placeholder">
        [Integração BD: Filtros de Relatórios]
      </div>
      <div className="reports-actions">
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="reports-csv-btn"
        >
          Baixar CSV
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="reports-pdf-btn"
        >
          Baixar PDF
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Reports;
