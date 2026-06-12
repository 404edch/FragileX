import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getSintomas } from "../../services/getSintomas";
import ChecklistItems from "./ChecklistItems";
import ItemCadastro from "./ItemCadastro";
import BotaoInicio from "../Shared/BotaoInicio";
import "./Checklist.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const promiseSintomas = getSintomas();

interface Props {
  isRapido?: boolean;
}

export default function PreencherChecklist({ isRapido = false }: Props) {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<number[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  // Para fluxo formal (não rápido)
  const [cpfBusca, setCpfBusca] = useState("");
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);

  // Para fluxo rápido
  const [sexoRapido, setSexoRapido] = useState<"M" | "F" | null>(null);

  // Quem está preenchendo (exigido para contas de paciente/familiares)
  const OPCOES_QUEM_PREENCHE = ["Pai", "Mãe", "Responsável", "Pedagogo", "Psicólogo", "Outro"];
  const [quemPreencheSelecionado, setQuemPreencheSelecionado] = useState("");
  const [quemPreencheOutro, setQuemPreencheOutro] = useState("");

  // Relatório Final (Modal)
  const [reportData, setReportData] = useState<any>(null);

  const navigate = useNavigate();
  const { usuario } = useAuth();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cpfParam = searchParams.get('cpf');

  useEffect(() => {
    // Se for paciente logado, busca os próprios dados automaticamente
    if (!isRapido && usuario && usuario.role === "paciente") {
      setIsLoadingPatient(true);
      api
        .get(`/patients/cpf/${usuario.cpf}`)
        .then((res) => {
          setPatientDetails(res);
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
          setPatientDetails(res);
          setStep(2);
        })
        .catch(() => {
          alert("Paciente não encontrado pelo CPF passado.");
        })
        .finally(() => setIsLoadingPatient(false));
    }
  }, [usuario, isRapido, cpfParam]);

  const handleBuscarPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfBusca) return;
    setIsLoadingPatient(true);
    try {
      const res = await api.get(`/patients/cpf/${cpfBusca}`);
      setPatientDetails(res);
      setStep(2);
    } catch (error: any) {
      alert("Paciente não encontrado. Verifique o CPF.");
    } finally {
      setIsLoadingPatient(false);
    }
  };

  const handleStartRapido = (e: React.FormEvent) => {
    e.preventDefault();
    if (sexoRapido) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const quemPreencheFinal =
      quemPreencheSelecionado === "Outro" ? (quemPreencheOutro.trim() ? `Outro: ${quemPreencheOutro.trim()}` : "") : quemPreencheSelecionado;

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
      idPaciente: patientDetails.id,
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
        setReportData(result);
      }
    } catch (error: any) {
      alert(error.message || "Erro ao salvar o checklist.");
    }
  };

  const isMale = isRapido ? sexoRapido === "M" : patientDetails?.pacienteDetails?.sexo_biologico === "M";

  // Modal Report Render
  const renderReportModal = () => {
    if (!reportData) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1100,
          padding: "20px",
        }}
      >
        <div
          className="dashboard-med-registration"
          style={{ maxWidth: "600px", width: "100%", background: "#fff", borderRadius: "16px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}
        >
          <h3 style={{ color: "#1a5fa8", fontSize: "24px", marginBottom: "8px", textAlign: "center" }}>
            {reportData.isRapido ? "Resultado Rápido (Não Salvo)" : "Relatório de Checklist Salvo"}
          </h3>

          <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: "16px", color: "#334155", marginBottom: "12px" }}>Classificação Final</h4>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: reportData.classificacao === "Suspeito" ? "#ef4444" : "#10b981",
                background: reportData.classificacao === "Suspeito" ? "#fef2f2" : "#ecfdf5",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
                border: `1px solid ${reportData.classificacao === "Suspeito" ? "#fca5a5" : "#6ee7b7"}`,
              }}
            >
              {reportData.classificacao === "Suspeito" ? "⚠️ Suspeito para FXS" : "✅ Negativo"}
            </div>
            <p style={{ marginTop: "8px", fontSize: "13px", color: "#64748b", textAlign: "center" }}>
              Score Total: <strong>{Number(reportData.score_final).toFixed(2)} pts</strong>
            </p>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h4 style={{ fontSize: "16px", color: "#334155", marginBottom: "8px" }}>Memória de Cálculo (Pesos Considerados)</h4>
            <pre
              style={{
                background: "#1e293b",
                color: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {reportData.memoria_calculo || "Nenhum sintoma selecionado."}
            </pre>
          </div>

          <button
            onClick={() => {
              setReportData(null);
              navigate("/dashboard");
            }}
            className="checklist-submit-btn"
            style={{ width: "100%", marginTop: "32px" }}
          >
            Concluir e Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="checklist-wrapper"
      style={{ position: "relative" }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          background: "none",
          border: "none",
          color: "#1a5fa8",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          zIndex: 10,
        }}
      >
        ← Voltar
      </button>

      {renderReportModal()}

      {step === 1 && (
        <div
          className="cadastro-form"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          <div className="checklist-container">
            <h2 className="checklist-title">Passo 1: Identificação</h2>

            {isRapido ? (
              <form onSubmit={handleStartRapido}>
                <p className="checklist-subtitle">Selecione o sexo biológico para aplicar a tabela de pesos correta.</p>
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="sexo"
                      value="M"
                      onChange={() => setSexoRapido("M")}
                      required
                    />{" "}
                    Masculino
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="sexo"
                      value="F"
                      onChange={() => setSexoRapido("F")}
                      required
                    />{" "}
                    Feminino
                  </label>
                </div>
                <button
                  type="submit"
                  className="checklist-submit-btn"
                  style={{ width: "100%" }}
                >
                  Avançar para Sintomas
                </button>
              </form>
            ) : usuario?.role !== "paciente" ? (
              <form onSubmit={handleBuscarPaciente}>
                <p className="checklist-subtitle">Digite o CPF do paciente para buscar a ficha e o sexo biológico antes de preencher os sintomas.</p>
                <div
                  className="cadastro-item"
                  style={{ marginBottom: "24px" }}
                >
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
                  className="checklist-submit-btn"
                  style={{ width: "100%" }}
                  disabled={isLoadingPatient}
                >
                  {isLoadingPatient ? "Buscando..." : "Buscar Paciente"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>Carregando seus dados...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <form
          className="cadastro-form"
          onSubmit={handleSubmit}
        >
          {!isRapido && patientDetails && (
            <div
              className="checklist-container"
              style={{ marginBottom: "24px" }}
            >
              <h2
                className="checklist-title"
                style={{ fontSize: "1.5rem" }}
              >
                Ficha do Paciente
              </h2>
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", marginBottom: "16px" }}>
                <p>
                  <strong>Nome:</strong> {patientDetails.nome}
                </p>
                <p>
                  <strong>CPF:</strong> {patientDetails.cpf}
                </p>
                <p>
                  <strong>Sexo Biológico:</strong> {patientDetails.pacienteDetails?.sexo_biologico === "M" ? "Masculino" : "Feminino"}
                </p>
              </div>

              {usuario?.role === "paciente" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div
                    className="cadastro-item"
                    style={{ marginBottom: 0 }}
                  >
                    <label className="cadastro-label">Quem está preenchendo o formulário?</label>
                    <select
                      className="cadastro-input"
                      value={quemPreencheSelecionado}
                      onChange={(e) => setQuemPreencheSelecionado(e.target.value)}
                      required
                      style={{ cursor: "pointer" }}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Selecione uma opção
                      </option>
                      {OPCOES_QUEM_PREENCHE.map((op) => (
                        <option
                          key={op}
                          value={op}
                        >
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  {quemPreencheSelecionado === "Outro" && (
                    <div
                      className="cadastro-item"
                      style={{ marginBottom: 0 }}
                    >
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
                <p className="checklist-subtitle">Marque os sintomas identificados no paciente. (Ocultando sintomas incompatíveis com sexo feminino)</p>

                <ChecklistItems
                  promiseSintomas={promiseSintomas.then((list) => list.filter((item) => (isMale ? true : item.nome.toLowerCase() !== "macroorquidismo")))}
                  onChange={setSintomasSelecionados}
                />
              </div>
            </Suspense>
          </ErrorBoundary>

          <div
            className="form-actions"
            style={{ gap: "16px" }}
          >
            <BotaoInicio
              label="Cancelar"
              to="/dashboard"
            />
            <button
              type="submit"
              className="checklist-submit-btn"
            >
              {isRapido ? "Calcular Score (Rápido)" : "Salvar Checklist e Calcular"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
