import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./Dashboard.css";

interface NotificacaoPCR {
  id: number;
  paciente_nome: string;
  preenchido_por: string;
  score_final: number;
  classificacao: string;
  lida: boolean;
  data_criacao: string;
}

const ChecklistNotifications = () => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoPCR[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarNotificacoes = async () => {
    try {
      const data = await api.get<NotificacaoPCR[]>("/notificacoes-pcr");
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const marcarComoLida = async (id: number) => {
    try {
      await api.patch(`/notificacoes-pcr/${id}/lida`, {});
      window.dispatchEvent(new Event("checklistAlertsUpdated"));
      await carregarNotificacoes();
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const naoLidas = notificacoes.filter((n) => !n.lida);
  const historico = notificacoes.filter((n) => n.lida);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Título Principal */}
      <div>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a5fa8", marginBottom: "10px" }}>Alertas de Checklist</h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>Acompanhe os resultados dos checklists de pré-triagem preenchidos pelos médicos.</p>
      </div>

      {/* Notificações Não Lidas */}
      <div className="dashboard-med-registration">
        <h3 style={{ fontSize: "18px", color: "#1a3a6e", marginBottom: "16px", fontWeight: "bold" }}>Não Lidas ({naoLidas.length})</h3>

        {naoLidas.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "#888", fontSize: "14px", fontStyle: "italic" }}>Nenhuma notificação pendente. Tudo em dia!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {naoLidas.map((notif) => (
              <div
                key={notif.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderLeft: `4px solid ${notif.classificacao === "Suspeito" ? "#ef4444" : "#10b981"}`,
                  borderRadius: "12px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <h4 style={{ margin: 0, color: "#1e293b", fontSize: "16px", fontWeight: "bold" }}>{notif.paciente_nome}</h4>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Preenchido por: {notif.preenchido_por}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      background: notif.classificacao === "Suspeito" ? "#fee2e2" : "#dcfce7",
                      color: notif.classificacao === "Suspeito" ? "#991b1b" : "#166534",
                      padding: "4px 8px",
                      borderRadius: "9999px",
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                    }}
                  >
                    {notif.classificacao}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    fontSize: "14px",
                    color: "#475569",
                    borderTop: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "12px 0",
                    background: "#ffffff",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ padding: "0 8px" }}>
                    <strong>📊 Score Final:</strong>
                    <br />
                    {notif.score_final} pts
                  </div>
                  <div style={{ padding: "0 8px" }}>
                    <strong>📅 Data:</strong>
                    <br />
                    {notif.data_criacao ? formatarData(notif.data_criacao) : "N/A"}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => marcarComoLida(notif.id)}
                    className="checklist-submit-btn"
                    style={{
                      margin: 0,
                      background: "#1a5fa8",
                      color: "white",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(26, 95, 168, 0.2)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    ✓ Marcar como lida
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Histórico */}
      <div className="dashboard-med-registration">
        <h3 style={{ fontSize: "18px", color: "#1a3a6e", marginBottom: "16px", fontWeight: "bold" }}>Histórico</h3>

        {historico.length === 0 ? (
          <p style={{ color: "#888", fontSize: "14px", fontStyle: "italic" }}>Nenhum registro no histórico.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {historico.map((notif) => (
              <div
                key={notif.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: "#475569", fontSize: "14px", fontWeight: "bold" }}>{notif.paciente_nome}</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                    Por: {notif.preenchido_por} | Score: {notif.score_final} pts | {notif.data_criacao ? formatarData(notif.data_criacao) : "N/A"}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    background: notif.classificacao === "Suspeito" ? "#fee2e2" : "#dcfce7",
                    color: notif.classificacao === "Suspeito" ? "#991b1b" : "#166534",
                    padding: "4px 8px",
                    borderRadius: "9999px",
                    fontWeight: "bold",
                  }}
                >
                  {notif.classificacao}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistNotifications;
