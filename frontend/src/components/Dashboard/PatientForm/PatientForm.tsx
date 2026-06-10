import React from 'react';
import { motion } from 'motion/react';
import './PatientForm.css';

interface PatientFormProps {
  onCancel: () => void;
  role: string;
}

const PatientForm = ({ onCancel, role }: PatientFormProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="patient-form-container">
      <h2 className="patient-form-title">Cadastrar Novo Paciente</h2>
      <form className="patient-form">
        <div className="patient-form-section">
           <label className="patient-form-label">Informações Básicas</label>
           <div className="patient-form-db-placeholder">[Integração BD: Inputs Básicos]</div>
        </div>
        <div className="patient-form-section">
           <label className="patient-form-label">Checklist de Sintomas</label>
           <div className="patient-form-db-placeholder">[Integração BD: Checkboxes de Sintomas]</div>
        </div>
        {role === 'medic' && (
          <div className="patient-form-section">
             <label className="patient-form-label">Importar Banco de Dados</label>
             <div className="patient-form-db-placeholder">[Lógica de Importação com Permissão Admin]</div>
          </div>
        )}
        <div className="patient-form-actions">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            type="button" 
            className="patient-form-save-btn"
          >
            Salvar Paciente
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            type="button" 
            onClick={onCancel} 
            className="patient-form-cancel-btn"
          >
            Cancelar
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientForm;
