import React, { useState } from "react";
import { consultaService } from "../../../services/consultaService";
import { MockConsulta } from "../../../services/types";
import "../PatientDashboard.css";

interface ConsultationsHistorySectionProps {
  notas: MockConsulta[];
  setNotas: (notas: MockConsulta[]) => void;
  usuario: any;
  paciente: any;
}

const ConsultationsHistorySection: React.FC<ConsultationsHistorySectionProps> = ({ notas, setNotas, usuario, paciente }) => {
  const [novaNota, setNovaNota] = useState("");
  const [enviandoNota, setEnviandoNota] = useState(false);
  const [editandoNotaId, setEditandoNotaId] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  const iniciarEdicaoNota = (nota: MockConsulta) => {
    setEditandoNotaId(nota.id);
    setTextoEdicao(nota.observacoes);
  };

  const cancelarEdicaoNota = () => {
    setEditandoNotaId(null);
    setTextoEdicao("");
  };

  const salvarEdicaoNota = async (idNota: number) => {
    if (!textoEdicao.trim()) return;
    try {
      await consultaService.atualizarNota(idNota, textoEdicao);
      const notasAtualizadas = await consultaService.listarNotasPaciente(paciente.id_usuario);
      setNotas(notasAtualizadas);
      setEditandoNotaId(null);
    } catch (err) {
      console.error("Erro ao atualizar nota", err);
      alert("Erro ao atualizar nota");
    }
  };

  const handleDeletarNota = async (idNota: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nota?")) return;
    try {
      await consultaService.deletarNota(idNota);
      const notasAtualizadas = await consultaService.listarNotasPaciente(paciente.id_usuario);
      setNotas(notasAtualizadas);
    } catch (err) {
      console.error("Erro ao deletar nota", err);
      alert("Erro ao excluir nota");
    }
  };

  const handleSalvarNota = async () => {
    if (!novaNota.trim() || !usuario) return;
    setEnviandoNota(true);
    try {
      await consultaService.adicionarNota(paciente.id_usuario, novaNota, usuario.id, usuario.nome || "Usuário", usuario.role || "paciente");
      setNovaNota("");
      const notasAtualizadas = await consultaService.listarNotasPaciente(paciente.id_usuario);
      setNotas(notasAtualizadas);
    } catch (err) {
      console.error("Erro ao adicionar nota", err);
    } finally {
      setEnviandoNota(false);
    }
  };

  return (
    <div className="dashboard-med-registration">
      <h3 className="patient-section-header">Histórico de Consultas / Notas</h3>

      {(usuario?.role === "medico" || usuario?.role === "instituto") && (
        <div className="patient-nota-form">
          <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#334155", marginBottom: "8px" }}>Adicionar Nova Nota</label>
          <textarea
            value={novaNota}
            onChange={(e) => setNovaNota(e.target.value)}
            placeholder="Digite as anotações da consulta ou acompanhamento..."
            className="patient-nota-textarea"
          />
          <button
            disabled={enviandoNota || !novaNota.trim()}
            onClick={handleSalvarNota}
            style={{
              padding: "10px 16px",
              background: "#1a5fa8",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: enviandoNota || !novaNota.trim() ? "not-allowed" : "pointer",
              opacity: enviandoNota || !novaNota.trim() ? 0.7 : 1,
              transition: "background 0.2s",
            }}
          >
            {enviandoNota ? "Salvando..." : "Salvar Nota"}
          </button>
        </div>
      )}

      {notas.length === 0 ? (
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            textAlign: "center",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px dashed #cbd5e1",
          }}
        >
          Nenhuma consulta ou nota registrada até o momento.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {notas.map((nota) => (
            <div key={nota.id} className="patient-nota-card">
              <div className="patient-nota-header">
                <div className="patient-nota-title-group">
                  <strong className="patient-nota-title">{nota.titulo}</strong>
                  <span className="patient-nota-autor">
                    Autor: {nota.autor_nome} ({nota.role_autor})
                  </span>
                </div>
                <div className="patient-nota-actions">
                  <span className="patient-nota-date">
                    {new Date(nota.data_consulta).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  {(usuario?.role === "admin" || usuario?.role === "instituto" || usuario?.id === nota.autor_id) && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      {editandoNotaId === nota.id ? (
                        <>
                          <button onClick={() => salvarEdicaoNota(nota.id)} className="patient-nota-btn-save">Salvar</button>
                          <button onClick={cancelarEdicaoNota} className="patient-nota-btn-cancel">Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => iniciarEdicaoNota(nota)} className="patient-nota-btn-edit">Editar</button>
                          <button onClick={() => handleDeletarNota(nota.id)} className="patient-nota-btn-delete">Excluir</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {editandoNotaId === nota.id ? (
                <textarea
                  value={textoEdicao}
                  onChange={(e) => setTextoEdicao(e.target.value)}
                  className="patient-nota-textarea-edit"
                />
              ) : (
                <p className="patient-nota-text">{nota.observacoes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsHistorySection;
