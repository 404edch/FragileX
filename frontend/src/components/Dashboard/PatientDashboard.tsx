import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { patientService } from "../../services/patientService";
import { doctorService } from "../../services/doctorService";
import { consultaService } from "../../services/consultaService";
import { checklistService } from "../../services/checklistService";
import { linkService } from "../../services/linkService";
import { MockConsulta } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";
import { getSintomas } from "../../services/getSintomas";

// CSS Styles
import "./Dashboard.css";
import "./PatientDashboard.css";

// Sub-components
import PersonalInfoSection from "./PatientDashboardSections/PersonalInfoSection";
import ReferralStatusSection from "./PatientDashboardSections/ReferralStatusSection";
import LinkRequestsSection from "./PatientDashboardSections/LinkRequestsSection";
import ChecklistHistorySection from "./PatientDashboardSections/ChecklistHistorySection";
import ConsultationsHistorySection from "./PatientDashboardSections/ConsultationsHistorySection";
import SupportContactsSection from "./PatientDashboardSections/SupportContactsSection";

interface PatientDashboardProps {
  idUsuario: number;
}

interface UsuarioReal {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  role?: "medico" | "instituto" | "paciente" | "admin";
  status?: "PENDING_ACTIVATION" | "ACTIVE";
}

interface PacienteReal {
  id_usuario: number;
  data_nascimento: string;
  sexo_biologico: "M" | "F";
  genero: string;
  sindrome: "normal" | "mutacao" | "pre_mutacao";
  nome_mae?: string | null;
  nome_pai?: string | null;
  responsavel_nome?: string | null;
  responsavel_parentesco?: string | null;
  responsavel_cpf?: string | null;
  cidade?: string | null;
  estado?: string | null;
  pais?: string | null;
  telefone_2?: string | null;
  whatsapp?: string | null;
  id_medico_responsavel?: number | null;
  foto_perfil?: string | null;
  encaminhamento_status?: "pendente" | "encaminhado" | "encaminhamento negado";
  classificacao_oficial?: string | null;
}

interface ChecklistPaciente {
  id: number;
  id_paciente: number;
  id_medico?: number | null;
  preenchido_por: string;
  score_final?: number;
  classificacao?: string;
  sintomas_selecionados: number[];
  sintomas_nomes?: string[];
  data_preenchimento: string;
}

interface VinculoPaciente {
  id: number;
  id_medico: number;
  nome_medico: string;
  id_paciente: number;
  status: "PENDING_LINK" | "LINK_APPROVED" | "LINK_DENIED";
  data_solicitacao: string;
}

const PatientDashboard = ({ idUsuario }: PatientDashboardProps) => {
  const navigate = useNavigate();
  const { atualizarUsuarioLogado, usuario } = useAuth();
  const [paciente, setPaciente] = useState<PacienteReal | null>(null);
  const [checklists, setChecklists] = useState<ChecklistPaciente[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<VinculoPaciente[]>([]);
  const [notas, setNotas] = useState<MockConsulta[]>([]);
  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioReal | null>(null);
  const [medicoResponsavelText, setMedicoResponsavelText] = useState<string>("Buscando...");
  const [sintomasMap, setSintomasMap] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const user = await userService.getUsuario(idUsuario);
      setUsuarioInfo(user);
      if (!user) {
        setPaciente(null);
        setChecklists([]);
        setSolicitacoes([]);
        setMedicoResponsavelText("Dados do paciente indisponíveis.");
        return;
      }

      const p = await patientService.getPaciente(idUsuario);
      setPaciente(p);

      if (p?.id_medico_responsavel) {
        try {
          const [medUser, medDet] = await Promise.all([
            userService.getUsuario(p.id_medico_responsavel),
            doctorService.getMedico(p.id_medico_responsavel)
          ]);
          setMedicoResponsavelText(medUser ? `${medUser.nome} (CRM: ${medDet?.crm || "N/A"})` : "Médico Associado");
        } catch {
          setMedicoResponsavelText("Médico Associado");
        }
      } else {
        setMedicoResponsavelText("Nenhum médico vinculado diretamente. Utilize o CPF para vincular a um médico parceiro.");
      }

      const [checklistsData, sintomasList, solicitacoesData, notasData] = await Promise.all([
        checklistService.obterChecklistsPaciente(idUsuario).catch(() => [] as ChecklistPaciente[]),
        getSintomas().catch(() => []),
        linkService.listarSolicitacoesVinculoPaciente(idUsuario).catch(() => [] as VinculoPaciente[]),
        consultaService.listarNotasPaciente(idUsuario).catch(() => [] as MockConsulta[]),
      ]);

      setChecklists(Array.isArray(checklistsData) ? checklistsData : []);
      setNotas(Array.isArray(notasData) ? notasData : []);

      const map: Record<number, string> = {};
      sintomasList.forEach((s) => {
        map[s.id] = s.nome;
      });
      setSintomasMap(map);

      setSolicitacoes(Array.isArray(solicitacoesData) ? solicitacoesData : []);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard do paciente:", error);
      setLoadError("Não foi possível carregar os dados do painel.");
    } finally {
      setIsLoading(false);
    }
  }, [idUsuario]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void carregarDados();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [carregarDados]);

  const handleResponderVinculo = async (idVinculo: number, aceitar: boolean) => {
    try {
      await linkService.responderSolicitacaoVinculo(idVinculo, aceitar);
      alert(aceitar ? "Vínculo com o médico aprovado com sucesso!" : "Vínculo com o médico recusado.");
      await carregarDados();
      await atualizarUsuarioLogado();
    } catch (error) {
      console.error("Erro ao responder solicitação de vínculo:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-med-registration" style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "#888" }}>Carregando dados do painel do paciente...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="dashboard-med-registration" style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "#dc2626", marginBottom: "8px" }}>{loadError}</p>
        <button type="button" className="checklist-submit-btn" style={{ margin: 0, padding: "8px 16px", fontSize: "13px" }} onClick={carregarDados}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!usuarioInfo || !paciente) {
    return (
      <div className="dashboard-med-registration" style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "#888" }}>Perfil do paciente não encontrado.</p>
      </div>
    );
  }

  const getStatusColor = (status: string | undefined) => {
    if (status === "encaminhado") return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", text: "#16a34a" };
    if (status === "encaminhamento negado") return { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444" };
    return { bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.3)", text: "#ca8a04" }; // pendente
  };

  const statusColors = getStatusColor(paciente.encaminhamento_status);

  return (
    <div className="patient-dashboard-container">
      {usuario?.role === "paciente" && (
        <div>
          <h2 className="patient-welcome-title">Olá, {usuarioInfo.nome}!</h2>
          <p className="patient-welcome-subtitle">Bem-vindo ao seu painel pessoal de acompanhamento da Síndrome do X Frágil.</p>
        </div>
      )}

      <div className="patient-dashboard-grid">
        <PersonalInfoSection usuarioInfo={usuarioInfo} paciente={paciente} />
        <ReferralStatusSection 
          paciente={paciente} 
          usuario={usuario} 
          statusColors={statusColors} 
          medicoResponsavelText={medicoResponsavelText} 
          setPaciente={setPaciente} 
        />
      </div>

      <LinkRequestsSection solicitacoes={solicitacoes} handleResponderVinculo={handleResponderVinculo} />
      
      <ChecklistHistorySection checklists={checklists} sintomasMap={sintomasMap} usuarioInfo={usuarioInfo} />
      
      <div className="patient-dashboard-grid">
        <ConsultationsHistorySection 
          notas={notas} 
          setNotas={setNotas} 
          usuario={usuario} 
          paciente={paciente} 
        />
        <SupportContactsSection usuario={usuario} />
      </div>
    </div>
  );
};

export default PatientDashboard;
