import { FormEvent } from "react";

interface Step1Props {
  isRapido: boolean;
  usuarioRole: string | null | undefined;
  sexoRapido: "M" | "F" | null;
  setSexoRapido: (val: "M" | "F") => void;
  cpfBusca: string;
  setCpfBusca: (val: string) => void;
  isLoadingPatient: boolean;
  onStartRapido: (e: FormEvent) => void;
  onBuscarPaciente: (e: FormEvent) => void;
}

export default function Step1Identification({
  isRapido,
  usuarioRole,
  sexoRapido,
  setSexoRapido,
  cpfBusca,
  setCpfBusca,
  isLoadingPatient,
  onStartRapido,
  onBuscarPaciente,
}: Step1Props) {
  return (
    <div className="cadastro-form checklist-step1-wrapper">
      <div className="checklist-container">
        <h2 className="checklist-title">Passo 1: Identificação</h2>

        {isRapido ? (
          <form onSubmit={onStartRapido}>
            <p className="checklist-subtitle">
              Selecione o sexo biológico para aplicar a tabela de pesos correta.
            </p>
            <div className="checklist-gender-selection">
              <label className="checklist-gender-label">
                <input
                  type="radio"
                  name="sexo"
                  value="M"
                  checked={sexoRapido === "M"}
                  onChange={() => setSexoRapido("M")}
                  required
                />{" "}
                Masculino
              </label>
              <label className="checklist-gender-label">
                <input
                  type="radio"
                  name="sexo"
                  value="F"
                  checked={sexoRapido === "F"}
                  onChange={() => setSexoRapido("F")}
                  required
                />{" "}
                Feminino
              </label>
            </div>
            <button type="submit" className="checklist-submit-btn checklist-step1-btn">
              Avançar para Sintomas
            </button>
          </form>
        ) : usuarioRole !== "paciente" ? (
          <form onSubmit={onBuscarPaciente}>
            <p className="checklist-subtitle">
              Digite o CPF do paciente para buscar a ficha e o sexo biológico antes de preencher os sintomas.
            </p>
            <div className="cadastro-item checklist-cpf-input-group">
              <label className="cadastro-label">CPF do Paciente</label>
              <input
                type="text"
                className="cadastro-input"
                placeholder="Somente números"
                value={cpfBusca}
                onChange={(e) => setCpfBusca(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="checklist-submit-btn checklist-step1-btn"
              disabled={isLoadingPatient}
            >
              {isLoadingPatient ? "Buscando..." : "Buscar Paciente"}
            </button>
          </form>
        ) : (
          <div className="checklist-loading-text">
            <p>Carregando seus dados...</p>
          </div>
        )}
      </div>
    </div>
  );
}
