import React from "react";
import "../PatientDashboard.css";

interface LinkRequestsSectionProps {
  solicitacoes: any[];
  handleResponderVinculo: (idVinculo: number, aceitar: boolean) => Promise<void>;
}

const LinkRequestsSection: React.FC<LinkRequestsSectionProps> = ({ solicitacoes, handleResponderVinculo }) => {
  return (
    <div
      className="dashboard-med-registration"
      style={{ border: solicitacoes.length > 0 ? "2px solid #1a5fa8" : "1px solid #e2e8f0" }}
    >
      <h3
        style={{
          fontSize: "18px",
          color: solicitacoes.length > 0 ? "#1a5fa8" : "#1a3a6e",
          marginBottom: "12px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>🔔</span> Solicitações de Vínculo Médico
      </h3>

      <div
        style={{
          background: "#f8fafc",
          padding: "16px",
          borderRadius: "10px",
          color: "#64748b",
          fontSize: "14px",
          border: "1px dashed #cbd5e1",
          marginBottom: solicitacoes.length > 0 ? "16px" : "0",
        }}
      >
        Caso você tenha um médico que acompanha seu caso, quando ele te importar a solicitação aparecerá aqui.
      </div>

      {solicitacoes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {solicitacoes.map((req) => (
            <div key={req.id} className="patient-link-request-card">
              <div style={{ fontSize: "14px", color: "#1e3a8a" }}>
                O médico <strong>{req.nome_medico}</strong> deseja acompanhar o seu caso clínico. Deseja permitir o vínculo e o acesso ao seu histórico?
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="checklist-submit-btn"
                  style={{ margin: 0, background: "#22c55e", color: "white", padding: "6px 14px", fontSize: "13px" }}
                  onClick={() => handleResponderVinculo(req.id, true)}
                >
                  Aceitar Vínculo
                </button>
                <button
                  type="button"
                  className="checklist-submit-btn"
                  style={{ margin: 0, background: "#ef4444", color: "white", padding: "6px 14px", fontSize: "13px" }}
                  onClick={() => handleResponderVinculo(req.id, false)}
                >
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkRequestsSection;
