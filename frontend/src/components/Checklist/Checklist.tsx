import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getSintomas } from "../../services/getSintomas";
import { sendCadastro } from "../../services/sendCadastro";
import ChecklistItems from "./ChecklistItems";
import DadosPessoais from "./DadosPessoais";
import "./Checklist.css";

const promiseSintomas = getSintomas();

export default function Checklist() {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<number[]>([]);

  const formAction = async (formData: FormData) => {
    const dadosPessoais = Object.fromEntries(formData.entries());

    const dadosFinais = {
      ...dadosPessoais,
      idSintomasSelecionados: sintomasSelecionados,
    };

    try {
      await sendCadastro(dadosFinais);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error);
      alert("Erro ao enviar cadastro. Tente novamente.");
    }
  };

  return (
    <div className="checklist-wrapper">
      <form
        action={formAction}
        className="cadastro-form"
      >
        <DadosPessoais />

        <ErrorBoundary
          fallback={
            <div className="checklist-container checklist-error-container">
              <h2 className="checklist-error-title">Ops! Algo deu errado.</h2>
              <p className="checklist-error-text">Não foi possível carregar a lista de sintomas no momento.</p>
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
              <h1 className="checklist-title">Checklist de Sintomas</h1>
              <p className="checklist-subtitle">Selecione os sintomas observados no paciente.</p>
              <ChecklistItems
                promiseSintomas={promiseSintomas}
                onChange={setSintomasSelecionados}
              />
            </div>
          </Suspense>
        </ErrorBoundary>

        <div className="form-actions">
          <button
            type="submit"
            className="checklist-submit-btn"
          >
            Finalizar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}
