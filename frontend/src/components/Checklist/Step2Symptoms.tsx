import { Suspense, FormEvent } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ChecklistItems from "./ChecklistItems";
import BotaoInicio from "../Shared/BotaoInicio";
import { PatientDetails } from "./types";
import { Sintoma } from "../../../../shared/classes/sintoma";

interface Step2Props {
  isRapido: boolean;
  isMale: boolean;
  usuarioRole: string | null | undefined;
  patientDetails: PatientDetails | null;
  quemPreencheSelecionado: string;
  setQuemPreencheSelecionado: (val: string) => void;
  quemPreencheOutro: string;
  setQuemPreencheOutro: (val: string) => void;
  OPCOES_QUEM_PREENCHE: string[];
  promiseSintomas: Promise<Sintoma[]>;
  setSintomasSelecionados: (val: number[]) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Step2Symptoms({
  isRapido,
  isMale,
  usuarioRole,
  patientDetails,
  quemPreencheSelecionado,
  setQuemPreencheSelecionado,
  quemPreencheOutro,
  setQuemPreencheOutro,
  OPCOES_QUEM_PREENCHE,
  promiseSintomas,
  setSintomasSelecionados,
  onSubmit,
}: Step2Props) {
  return (
    <form className="cadastro-form" onSubmit={onSubmit}>
      {!isRapido && patientDetails && (
        <div className="checklist-container checklist-patient-details-container">
          <h2 className="checklist-title checklist-patient-details-title">Ficha do Paciente</h2>
          <div className="checklist-patient-details-card">
            <p>
              <strong>Nome:</strong> {patientDetails.nome}
            </p>
            <p>
              <strong>CPF:</strong> {patientDetails.cpf}
            </p>
            <p>
              <strong>Sexo Biológico:</strong>{" "}
              {patientDetails.pacienteDetails?.sexo_biologico === "M" ? "Masculino" : "Feminino"}
            </p>
          </div>

          {usuarioRole === "paciente" && (
            <div className="checklist-filler-info">
              <div className="cadastro-item checklist-filler-select-group">
                <label className="cadastro-label">Quem está preenchendo o formulário?</label>
                <select
                  className="cadastro-input checklist-filler-select"
                  value={quemPreencheSelecionado}
                  onChange={(e) => setQuemPreencheSelecionado(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {OPCOES_QUEM_PREENCHE.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {quemPreencheSelecionado === "Outro" && (
                <div className="cadastro-item checklist-filler-other-group">
                  <label className="cadastro-label">Especifique:</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    placeholder="Ex: Avó, Cuidador, Terapeuta..."
                    value={quemPreencheOutro}
                    onChange={(e) => setQuemPreencheOutro(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ErrorBoundary
        fallback={
          <div className="checklist-container checklist-error-container">
            <h2 className="checklist-error-title">Ops! Algo deu errado.</h2>
            <button
              type="button"
              className="checklist-retry-btn"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </button>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="checklist-container">
              <h2 className="checklist-loading">Carregando checklist...</h2>
            </div>
          }
        >
          <div className="checklist-container">
            <h1 className="checklist-title">{isRapido ? "Checklist Rápido" : "Checklist Clínico (X Frágil)"}</h1>
            <p className="checklist-subtitle">
              Marque os sintomas identificados no paciente. (Ocultando sintomas incompatíveis com sexo feminino)
            </p>

            <ChecklistItems
              promiseSintomas={promiseSintomas}
              isMale={isMale}
              onChange={setSintomasSelecionados}
            />
          </div>
        </Suspense>
      </ErrorBoundary>

      <div className="form-actions checklist-form-actions">
        <BotaoInicio label="Cancelar" to="/dashboard" />
        <button type="submit" className="checklist-submit-btn">
          {isRapido ? "Calcular Score (Rápido)" : "Salvar Checklist e Calcular"}
        </button>
      </div>
    </form>
  );
}
