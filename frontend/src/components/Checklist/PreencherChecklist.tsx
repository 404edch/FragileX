import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getSintomas } from "../../services/getSintomas";
import "./Checklist.css";

import { usePatientData } from "./hooks/usePatientData";
import { useChecklistSubmit } from "./hooks/useChecklistSubmit";

import Step1Identification from "./Step1Identification";
import Step2Symptoms from "./Step2Symptoms";
import ReportModal from "./ReportModal";

const promiseSintomas = getSintomas();

interface Props {
  isRapido?: boolean;
}

export default function PreencherChecklist({ isRapido = false }: Props) {
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const cpfParam = searchParams.get("cpf");

  const [sintomasSelecionados, setSintomasSelecionados] = useState<number[]>([]);
  const [sexoRapido, setSexoRapido] = useState<"M" | "F" | null>(null);

  // Quem está preenchendo (exigido para contas de paciente/familiares)
  const OPCOES_QUEM_PREENCHE = ["Pai", "Mãe", "Responsável", "Pedagogo", "Psicólogo", "Outro"];
  const [quemPreencheSelecionado, setQuemPreencheSelecionado] = useState("");
  const [quemPreencheOutro, setQuemPreencheOutro] = useState("");

  const {
    cpfBusca,
    setCpfBusca,
    patientDetails,
    isLoadingPatient,
    step,
    setStep,
    handleBuscarPaciente,
  } = usePatientData(usuario, isRapido, cpfParam);

  const { handleSubmit, reportData, closeReport } = useChecklistSubmit({
    isRapido,
    sexoRapido,
    patientDetails,
    usuario,
    quemPreencheSelecionado,
    quemPreencheOutro,
    sintomasSelecionados,
    promiseSintomas,
  });

  const handleStartRapido = (e: React.FormEvent) => {
    e.preventDefault();
    if (sexoRapido) setStep(2);
  };

  const isMale = isRapido
    ? sexoRapido === "M"
    : patientDetails?.pacienteDetails?.sexo_biologico === "M";

  return (
    <div className="checklist-wrapper">
      <button type="button" onClick={() => navigate(-1)} className="checklist-back-btn">
        ← Voltar
      </button>

      <ReportModal reportData={reportData} onClose={closeReport} />

      {step === 1 && (
        <Step1Identification
          isRapido={isRapido}
          usuarioRole={usuario?.role}
          sexoRapido={sexoRapido}
          setSexoRapido={setSexoRapido}
          cpfBusca={cpfBusca}
          setCpfBusca={setCpfBusca}
          isLoadingPatient={isLoadingPatient}
          onStartRapido={handleStartRapido}
          onBuscarPaciente={handleBuscarPaciente}
        />
      )}

      {step === 2 && (
        <Step2Symptoms
          isRapido={isRapido}
          isMale={isMale}
          usuarioRole={usuario?.role}
          patientDetails={patientDetails}
          quemPreencheSelecionado={quemPreencheSelecionado}
          setQuemPreencheSelecionado={setQuemPreencheSelecionado}
          quemPreencheOutro={quemPreencheOutro}
          setQuemPreencheOutro={setQuemPreencheOutro}
          OPCOES_QUEM_PREENCHE={OPCOES_QUEM_PREENCHE}
          promiseSintomas={promiseSintomas}
          setSintomasSelecionados={setSintomasSelecionados}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

