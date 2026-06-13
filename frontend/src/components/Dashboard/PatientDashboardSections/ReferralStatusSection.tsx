import React from "react";
import { patientService } from "../../../services/patientService";
import "../PatientDashboard.css";

interface ReferralStatusSectionProps {
  paciente: any;
  usuario: any;
  statusColors: {
    bg: string;
    border: string;
    text: string;
  };
  medicoResponsavelText: string;
  setPaciente: (p: any) => void;
}

const ReferralStatusSection: React.FC<ReferralStatusSectionProps> = ({
  paciente,
  usuario,
  statusColors,
  medicoResponsavelText,
  setPaciente,
}) => {
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    try {
      await patientService.updatePatientStatus(paciente.id_usuario, nextStatus);
      setPaciente({ ...paciente, encaminhamento_status: nextStatus });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  return (
    <div className="dashboard-med-registration patient-section-card" style={{ justifyContent: "space-between" }}>
      <div>
        <h3 className="patient-section-header">Encaminhamento de Exame (PCR)</h3>

        {usuario?.role === "instituto" ? (
          <div style={{ marginBottom: "16px" }}>
            <span className="patient-status-label">Status Atual do Processo ✏️</span>
            <select
              value={paciente.encaminhamento_status}
              onChange={handleStatusChange}
              className="patient-status-select"
              style={{
                border: `1px solid ${statusColors.border}`,
                background: statusColors.bg,
                color: statusColors.text,
              }}
            >
              <option value="pendente">Pendente</option>
              <option value="encaminhado">Encaminhado</option>
              <option value="encaminhamento negado">Não Encaminhado</option>
            </select>
          </div>
        ) : (
          <div
            className="patient-status-display"
            style={{
              background: statusColors.bg,
              border: `1px solid ${statusColors.border}`,
            }}
          >
            <span className="patient-status-label">Status Atual do Processo</span>
            <strong
              className="patient-status-text"
              style={{ color: statusColors.text }}
            >
              {paciente.encaminhamento_status === "encaminhado"
                ? "Encaminhado"
                : paciente.encaminhamento_status === "encaminhamento negado"
                ? "Não Encaminhado"
                : "Pendente"}
            </strong>
          </div>
        )}

        <p className="patient-status-description">
          {paciente.encaminhamento_status === "encaminhado"
            ? "Com base no checklist preenchido, os critérios clínicos foram atendidos. O encaminhamento do exame genético de PCR de X Frágil foi emitido."
            : paciente.encaminhamento_status === "encaminhamento negado"
            ? "Com base no checklist, os sintomas indicam paciente não afetado no momento."
            : "Você precisa ter um checklist preenchido pelo médico ou instituto para avaliar os sintomas e emitir o encaminhamento ao exame molecular."}
        </p>
      </div>

      <div className="patient-medico-info">
        <strong>Médico Responsável:</strong>
        <br />
        <span className="patient-medico-name">{medicoResponsavelText}</span>
      </div>
    </div>
  );
};

export default ReferralStatusSection;
