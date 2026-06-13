import { ReportData } from "./types";

interface ReportModalProps {
  reportData: ReportData | null;
  onClose: () => void;
}

export default function ReportModal({ reportData, onClose }: ReportModalProps) {
  if (!reportData) return null;

  return (
    <div className="checklist-modal-overlay">
      <div className="dashboard-med-registration checklist-modal-content">
        <h3 className="checklist-modal-title">
          {reportData.isRapido ? "Resultado Rápido (Não Salvo)" : "Relatório de Checklist Salvo"}
        </h3>

        <div className="checklist-modal-section">
          <h4 className="checklist-modal-subtitle">Classificação Final</h4>
          <div
            className={`checklist-modal-result ${
              reportData.classificacao === "Suspeito" ? "result-suspeito" : "result-negativo"
            }`}
          >
            {reportData.classificacao === "Suspeito" ? "⚠️ Suspeito para FXS" : "✅ Negativo"}
          </div>
          <p className="checklist-modal-score">
            Score Total: <strong>{Number(reportData.score_final).toFixed(2)} pts</strong>
          </p>
        </div>

        <div className="checklist-modal-section-margin">
          <h4 className="checklist-modal-subtitle">Memória de Cálculo (Pesos Considerados)</h4>
          <pre className="checklist-modal-pre">
            {reportData.memoria_calculo || "Nenhum sintoma selecionado."}
          </pre>
        </div>

        <button onClick={onClose} className="checklist-submit-btn checklist-modal-btn">
          Concluir e Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
