import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PatientCard from "./PatientCard/PatientCard";
import { backendService } from "../../services/backendService";
import { useAuth } from "../../contexts/AuthContext";

export default function PatientCardPage() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const patientIdNum = Number(id);
  const [user, setUser] = useState<any | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [temPermissao, setTemPermissao] = useState<boolean | null>(null);

  const calculateAge = (dob: string) => {
    try {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const carregarPacienteEPermissoes = async () => {
      if (!usuario || isNaN(patientIdNum)) {
        setTemPermissao(false);
        return;
      }

      try {
        const u = await backendService.getUsuario(patientIdNum);
        const d = await backendService.getPaciente(patientIdNum);
        setUser(u);
        setDetails(d);

        let permissao = false;
        if (usuario.role === "admin" || usuario.role === "instituto") {
          permissao = true;
        } else if (usuario.role === "paciente" && usuario.id === patientIdNum) {
          permissao = true;
        } else if (usuario.role === "medico") {
          const pacientesDoMedico = await backendService.listarPacientesDoMedico(usuario.id);
          permissao = pacientesDoMedico.some((p) => p.id === patientIdNum);
        }
        setTemPermissao(permissao);
      } catch (error) {
        console.error("Erro ao carregar dados do paciente/permissões:", error);
        setTemPermissao(false);
      }
    };
    carregarPacienteEPermissoes();
  }, [usuario, patientIdNum]);

  if (!usuario) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "30px", borderRadius: "12px", textAlign: "center" }}>
          <h2>Acesso Negado</h2>
          <p>Você precisa estar autenticado para visualizar esta página.</p>
        </div>
      </div>
    );
  }

  if (temPermissao === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <h2>Carregando prontuário...</h2>
      </div>
    );
  }

  if (!temPermissao) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <h2 style={{ color: "#ff4d4f", marginBottom: "16px" }}>Acesso Não Autorizado</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.5", marginBottom: "24px" }}>
            Você não possui um vínculo ativo ou aprovado para visualizar as informações clínicas deste paciente.
          </p>
          <button
            type="button"
            className="checklist-submit-btn"
            style={{ width: "auto", margin: "0 auto", display: "inline-block" }}
            onClick={() => navigate("/dashboard")}
          >
            Fechar Janela
          </button>
        </div>
      </div>
    );
  }

  const patient =
    user && details
      ? {
          id: user.id,
          name: user.nome,
          age: calculateAge(details.data_nascimento),
          sex: details.sexo_biologico,
          lastConsultation: details.id_medico_responsavel ? "2026-05-15" : "Sem consulta vinculada",
          tag: details.id_medico_responsavel ? "Acompanhamento" : "Sem Médico",
          responsibleFigure: details.responsavel_nome,
          phone: details.whatsapp || details.telefone_2 || "",
          foto_perfil: details.foto_perfil,
          classificacao_oficial: details.classificacao_oficial,
          encaminhamento_status: details.encaminhamento_status,
        }
      : null;

  if (patient) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <PatientCard
            patient={patient}
            onClose={() => navigate("/dashboard")}
            role={usuario.role}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ padding: 20, textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Paciente não encontrado.</h2>
      </div>
    );
  }
}
