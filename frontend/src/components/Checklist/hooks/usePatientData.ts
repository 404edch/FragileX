import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import { PatientDetails } from "../types";
import { Usuario } from "../../../contexts/AuthContext";

export function usePatientData(usuario: Usuario | null, isRapido: boolean, cpfParam: string | null) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      // Se for paciente logado, busca os próprios dados automaticamente
      if (!isRapido && usuario && usuario.role === "paciente") {
        setIsLoadingPatient(true);
        api
          .get(`/patients/cpf/${usuario.cpf}`)
          .then((res) => {
            setPatientDetails(res as PatientDetails);
            setStep(2);
          })
          .catch(() => {
            alert("Erro ao carregar dados do paciente.");
          })
          .finally(() => setIsLoadingPatient(false));
      } else if (!isRapido && cpfParam) {
        setCpfBusca(cpfParam);
        setIsLoadingPatient(true);
        api
          .get(`/patients/cpf/${cpfParam}`)
          .then((res) => {
            setPatientDetails(res as PatientDetails);
            setStep(2);
          })
          .catch(() => {
            alert("Paciente não encontrado pelo CPF passado.");
          })
          .finally(() => setIsLoadingPatient(false));
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [usuario, isRapido, cpfParam]);

  const handleBuscarPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfBusca) return;
    setIsLoadingPatient(true);
    try {
      const res = await api.get(`/patients/cpf/${cpfBusca}`);
      setPatientDetails(res as PatientDetails);
      setStep(2);
    } catch {
      alert("Paciente não encontrado. Verifique o CPF.");
    } finally {
      setIsLoadingPatient(false);
    }
  };

  return {
    cpfBusca,
    setCpfBusca,
    patientDetails,
    isLoadingPatient,
    step,
    setStep,
    handleBuscarPaciente,
  };
}
