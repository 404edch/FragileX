import React from "react";
import { useNavigate } from "react-router-dom";
import "../PatientDashboard.css";

interface ChecklistHistorySectionProps {
  checklists: any[];
  sintomasMap: Record<number, string>;
  usuarioInfo: any;
}

const ChecklistHistorySection: React.FC<ChecklistHistorySectionProps> = ({ checklists, sintomasMap, usuarioInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-med-registration">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <h3 style={{ fontSize: "18px", color: "#1a3a6e", margin: 0, fontWeight: "bold" }}>Histórico de Checklists</h3>
        <button
          type="button"
          className="checklist-submit-btn"
          style={{ margin: 0, padding: "8px 16px", fontSize: "13px" }}
          onClick={() => navigate(`/preencher-checklist?cpf=${usuarioInfo.cpf}`)}
        >
          + Preencher Nova Checklist
        </button>
      </div>

      {checklists.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Nenhum checklist de sintomas registrado.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {checklists.map((ch) => (
            <div key={ch.id} className="patient-checklist-card">
              <div className="patient-checklist-header">
                <div className="patient-checklist-title">
                  Checklist de Sintomas ({ch.sintomas_selecionados?.length || 0} sintomas identificados)
                  {ch.classificacao && (
                    <span
                      className="patient-checklist-badge"
                      style={{
                        background: ch.classificacao === "Suspeito" ? "#fef2f2" : "#ecfdf5",
                        color: ch.classificacao === "Suspeito" ? "#ef4444" : "#10b981",
                        border: `1px solid ${ch.classificacao === "Suspeito" ? "#fecaca" : "#a7f3d0"}`,
                      }}
                    >
                      {ch.classificacao === "Suspeito" ? "⚠️ Suspeito" : "✅ Negativo"}
                    </span>
                  )}
                </div>
                <div className="patient-checklist-date">
                  {new Date(ch.data_preenchimento).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(ch.data_preenchimento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="patient-checklist-author">
                <strong>Preenchido por:</strong> {ch.preenchido_por}
              </div>
              {ch.sintomas_selecionados && ch.sintomas_selecionados.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {ch.sintomas_selecionados.map((idSintoma: number) => (
                    <span key={idSintoma} className="patient-sintoma-badge">
                      {sintomasMap[idSintoma] || `Sintoma #${idSintoma}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistHistorySection;
