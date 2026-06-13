import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { ReportData, PatientDetails } from "../types";
import { Usuario } from "../../../contexts/AuthContext";
import { Sintoma } from "../../../../shared/classes/sintoma";

interface UseChecklistSubmitProps {
  isRapido: boolean;
  sexoRapido: "M" | "F" | null;
  patientDetails: PatientDetails | null;
  usuario: Usuario | null;
  quemPreencheSelecionado: string;
  quemPreencheOutro: string;
  sintomasSelecionados: number[];
  promiseSintomas: Promise<Sintoma[]>;
}

export function useChecklistSubmit({
  isRapido,
  sexoRapido,
  patientDetails,
  usuario,
  quemPreencheSelecionado,
  quemPreencheOutro,
  sintomasSelecionados,
  promiseSintomas,
}: UseChecklistSubmitProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quemPreencheFinal =
      quemPreencheSelecionado === "Outro"
        ? quemPreencheOutro.trim()
          ? `Outro: ${quemPreencheOutro.trim()}`
          : ""
        : quemPreencheSelecionado;

    if (!isRapido && usuario?.role === "paciente" && !quemPreencheFinal) {
      alert("Por favor, informe quem está preenchendo o formulário.");
      return;
    }

    if (isRapido) {
      // Checklist rápido - Cálculo local mockado
      const sintomasList = await promiseSintomas;
      const scoreEstimado = sintomasSelecionados.reduce((sum, id) => {
        const s = sintomasList.find((item) => item.id === id);
        if (!s) return sum;
        return sum + (sexoRapido === "M" ? Number(s.peso_M) : Number(s.peso_F));
      }, 0);

      const classificacao = scoreEstimado >= (sexoRapido === "M" ? 0.56 : 0.55) ? "Suspeito" : "Negativo";

      const calculos = sintomasSelecionados
        .map((id) => {
          const s = sintomasList.find((item) => item.id === id);
          return s ? `${s.nome}: ${sexoRapido === "M" ? s.peso_M : s.peso_F}` : "";
        })
        .join("\n");

      setReportData({
        score_final: scoreEstimado,
        classificacao,
        memoria_calculo: calculos,
        sintomas_identificados: sintomasSelecionados.map((id) => sintomasList.find((item) => item.id === id)?.nome),
        isRapido: true,
      });
      return;
    }

    // Fluxo Formal
    const payload = {
      idPaciente: patientDetails?.id,
      idMedico: usuario?.role === "medico" ? usuario.id : null,
      preenchidoPor: usuario?.role === "paciente" ? quemPreencheFinal : usuario?.nome || "Anônimo",
      sintomasSelecionados,
    };

    try {
      const result = await api.post("/checklists", payload);

      if (usuario?.role === "paciente") {
        alert("Checklist enviado com sucesso! Seus dados foram salvos com segurança no sistema.");
        navigate("/dashboard");
      } else {
        // Exibir modal para médico/instituto/admin
        setReportData(result as ReportData);
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Erro ao salvar o checklist.");
    }
  };

  const closeReport = () => {
    setReportData(null);
    navigate("/dashboard");
  };

  return { handleSubmit, reportData, closeReport };
}
