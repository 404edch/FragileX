import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getSintomas } from "../../services/getSintomas";
import ChecklistItems from "./ChecklistItems";
import ItemCadastro from "./ItemCadastro";
import BotaoInicio from "../Shared/BotaoInicio";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";

const promiseSintomas = getSintomas();

interface Props {
  isRapido?: boolean;
}

export default function PreencherChecklist({ isRapido = false }: Props) {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleFinalizar = () => {
    if (isRapido) {
      alert(`Checklist Rápido finalizado!\nSintomas selecionados: ${sintomasSelecionados.length}\n(Score estimado: ${(sintomasSelecionados.length * 2.5).toFixed(1)})`);
    } else {
      console.log("Enviando sintomas para o banco:", sintomasSelecionados);
      alert("Checklist formal salvo com sucesso para o paciente!");
    }
    navigate('/dashboard');
  };

  return (
    <div className="checklist-wrapper">
      <form className="cadastro-form" onSubmit={(e) => { e.preventDefault(); handleFinalizar(); }}>

        {!isRapido && (
          <div className="checklist-container" style={{ marginBottom: "24px" }}>
            <h2 className="checklist-title" style={{ fontSize: '1.5rem' }}>Identificação do Paciente</h2>
            <p className="checklist-subtitle">Informe os dados básicos do paciente para vincular este checklist.</p>
            <div className="cadastro-grid">
              <ItemCadastro label="Nome do Paciente" name="nomePaciente" required />
              <ItemCadastro label="E-mail" name="emailPaciente" type="email" required />
              <ItemCadastro label="CPF" name="cpfPaciente" required />
            </div>
          </div>
        )}

        <ErrorBoundary
          fallback={
            <div className="checklist-container checklist-error-container">
              <h2 className="checklist-error-title">Ops! Algo deu errado.</h2>
              <button className="checklist-retry-btn" onClick={() => window.location.reload()}>
                Tentar Novamente
              </button>
            </div>
          }
        >
          <Suspense fallback={<div className="checklist-container"><h2 className="checklist-loading">Carregando checklist...</h2></div>}>
            <div className="checklist-container">
              <h1 className="checklist-title">
                {isRapido ? "Checklist Rápido (Sem Vínculo)" : "Checklist de Sintomas"}
              </h1>
              <p className="checklist-subtitle">
                {isRapido
                  ? "Avalie os sintomas rapidamente. Estes dados não serão salvos no banco de dados."
                  : "Selecione os sintomas observados no paciente."}
              </p>
              <ChecklistItems
                promiseSintomas={promiseSintomas}
                onChange={setSintomasSelecionados}
              />
            </div>
          </Suspense>
        </ErrorBoundary>

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio />
          <button type="submit" className="checklist-submit-btn">
            {isRapido ? "Calcular Score" : "Salvar Checklist"}
          </button>
        </div>
      </form>
    </div>
  );
}
