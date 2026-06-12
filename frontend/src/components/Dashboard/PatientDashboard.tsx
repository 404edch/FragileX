import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { backendService } from "../../services/backendService";
import { useAuth } from "../../contexts/AuthContext";
import { getSintomas } from "../../services/getSintomas";
import "./Dashboard.css";

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
  const { atualizarUsuarioLogado } = useAuth();
  const [paciente, setPaciente] = useState<PacienteReal | null>(null);
  const [checklists, setChecklists] = useState<ChecklistPaciente[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<VinculoPaciente[]>([]);
  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioReal | null>(null);
  const [medicoResponsavelText, setMedicoResponsavelText] = useState<string>("Buscando...");
  const [sintomasMap, setSintomasMap] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const user = await backendService.getUsuario(idUsuario);
      setUsuarioInfo(user);
      if (!user) {
        setPaciente(null);
        setChecklists([]);
        setSolicitacoes([]);
        setMedicoResponsavelText("Dados do paciente indisponíveis.");
        return;
      }

      const p = await backendService.getPaciente(idUsuario);
      setPaciente(p);

      if (p?.id_medico_responsavel) {
        try {
          const [medUser, medDet] = await Promise.all([backendService.getUsuario(p.id_medico_responsavel), backendService.getMedico(p.id_medico_responsavel)]);
          setMedicoResponsavelText(medUser ? `${medUser.nome} (CRM: ${medDet?.crm || "N/A"})` : "Médico Associado");
        } catch {
          setMedicoResponsavelText("Médico Associado");
        }
      } else {
        setMedicoResponsavelText("Nenhum médico vinculado diretamente. Utilize o CPF para vincular a um médico parceiro.");
      }

      const [checklistsData, sintomasList, solicitacoesData] = await Promise.all([
        backendService.obterChecklistsPaciente(idUsuario).catch(() => [] as ChecklistPaciente[]),
        getSintomas().catch(() => []),
        backendService.listarSolicitacoesVinculoPaciente(idUsuario).catch(() => [] as VinculoPaciente[]),
      ]);

      setChecklists(Array.isArray(checklistsData) ? checklistsData : []);

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
      await backendService.responderSolicitacaoVinculo(idVinculo, aceitar);
      alert(aceitar ? "Vínculo com o médico aprovado com sucesso!" : "Vínculo com o médico recusado.");
      await carregarDados();
      await atualizarUsuarioLogado();
    } catch (error) {
      console.error("Erro ao responder solicitação de vínculo:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        className="dashboard-med-registration"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <p style={{ color: "#888" }}>Carregando dados do painel do paciente...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className="dashboard-med-registration"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <p style={{ color: "#dc2626", marginBottom: "8px" }}>{loadError}</p>
        <button
          type="button"
          className="checklist-submit-btn"
          style={{ margin: 0, padding: "8px 16px", fontSize: "13px" }}
          onClick={carregarDados}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!usuarioInfo || !paciente) {
    return (
      <div
        className="dashboard-med-registration"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <p style={{ color: "#888" }}>Perfil do paciente não encontrado.</p>
      </div>
    );
  }

  // Calcular idade simples baseada na data de nascimento
  const calcularIdade = (dataNasc: string) => {
    try {
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return isNaN(idade) ? "N/A" : `${idade} anos`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Mensagem de Boas-Vindas */}
      <div>
        <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "#1a5fa8", marginBottom: "6px" }}>Olá, {usuarioInfo.nome}!</h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>Bem-vindo ao seu painel pessoal de acompanhamento da Síndrome do X Frágil.</p>
      </div>

      {/* Grid de Seções do Painel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Seção 1: DADOS PESSOAIS */}
        <div
          className="dashboard-med-registration"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <h3
            style={{
              fontSize: "18px",
              color: "#1a3a6e",
              borderBottom: "2px solid rgba(26,95,168,0.1)",
              paddingBottom: "8px",
              marginBottom: "16px",
              fontWeight: "bold",
            }}
          >
            Dados Pessoais
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#475569" }}>
            <p>
              <strong>Nome Completo:</strong> {usuarioInfo.nome}
            </p>
            <p>
              <strong>Responsável:</strong> {paciente.responsavel_nome} ({paciente.responsavel_parentesco})
            </p>
            <p>
              <strong>Idade:</strong> {calcularIdade(paciente.data_nascimento)} | <strong>Nascimento:</strong> {paciente.data_nascimento}
            </p>
            <p>
              <strong>Sexo Biológico:</strong> {paciente.sexo_biologico} | <strong>Gênero:</strong> {paciente.genero}
            </p>
            <p>
              <strong>CPF:</strong> {usuarioInfo.cpf}
            </p>
            <p>
              <strong>Cidade/UF:</strong> {paciente.cidade} - {paciente.estado}
            </p>
            <p>
              <strong>País:</strong> {paciente.pais}
            </p>
            <p>
              <strong>E-mail:</strong> {usuarioInfo.email}
            </p>
          </div>
        </div>

        {/* Seção 4: STATUS DO ENCAMINHAMENTO */}
        <div
          className="dashboard-med-registration"
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
        >
          <div>
            <h3
              style={{
                fontSize: "18px",
                color: "#1a3a6e",
                borderBottom: "2px solid rgba(26,95,168,0.1)",
                paddingBottom: "8px",
                marginBottom: "16px",
                fontWeight: "bold",
              }}
            >
              Encaminhamento de Exame (PCR)
            </h3>

            <div
              style={{
                background: paciente.encaminhamento_status === "encaminhado" ? "rgba(34, 197, 94, 0.1)" : "rgba(234, 179, 8, 0.1)",
                border: paciente.encaminhamento_status === "encaminhado" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(234, 179, 8, 0.3)",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "bold", marginBottom: "4px" }}>
                Status Atual do Processo
              </span>
              <strong
                style={{
                  fontSize: "18px",
                  color: paciente.encaminhamento_status === "encaminhado" ? "#16a34a" : "#ca8a04",
                  textTransform: "uppercase",
                }}
              >
                {paciente.encaminhamento_status === "encaminhado"
                  ? "Encaminhado para PCR"
                  : paciente.encaminhamento_status === "encaminhamento negado"
                    ? "Encaminhamento negado"
                    : "Aguardando Checklist Inicial"}
              </strong>
            </div>

            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
              {paciente.encaminhamento_status === "encaminhado"
                ? "Com base no checklist preenchido, os critérios clínicos foram atendidos. O encaminhamento do exame genético de PCR de X Frágil foi emitido."
                : paciente.encaminhamento_status === "encaminhamento negado"
                  ? "No momento o encaminhamento não foi aprovado. Fale com o médico responsável para revisar os dados do acompanhamento."
                  : "Você precisa ter um checklist preenchido pelo médico para avaliar os sintomas e emitir o encaminhamento ao exame molecular."}
            </p>
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "16px", fontSize: "13px", color: "#475569" }}>
            <strong>Médico Responsável:</strong>
            <br />
            <span style={{ color: "#1a5fa8" }}>{medicoResponsavelText}</span>
          </div>
        </div>
      </div>

      {/* Solicitações de Vínculo de Médicos (Seção 5) */}
      {solicitacoes.length > 0 && (
        <div
          className="dashboard-med-registration"
          style={{ border: "2px solid #1a5fa8" }}
        >
          <h3 style={{ fontSize: "18px", color: "#1a5fa8", marginBottom: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔔</span> Solicitações de Vínculo Médico Pendentes
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {solicitacoes.map((req) => (
              <div
                key={req.id}
                style={{
                  background: "#f0f7ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "14px", color: "#1e3a8a" }}>
                  O médico <strong>{req.nome_medico}</strong> deseja acompanhar o seu caso clínico. Deseja permitir o vínculo e o acesso ao seu histórico?
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="checklist-submit-btn"
                    style={{ margin: 0, background: "#22c55e", color: "white", padding: "6px 14px", fontSize: "13px" }}
                    onClick={() => handleResponderVinculo(req.id, true)}
                  >
                    Aceitar Vínculo
                  </button>
                  <button
                    type="button"
                    className="checklist-submit-btn"
                    style={{ margin: 0, background: "#ef4444", color: "white", padding: "6px 14px", fontSize: "13px" }}
                    onClick={() => handleResponderVinculo(req.id, false)}
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seção 2: CHECKLISTS */}
      <div className="dashboard-med-registration">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ fontSize: "18px", color: "#1a3a6e", margin: 0, fontWeight: "bold" }}>Histórico de Checklists</h3>
          <button
            type="button"
            className="checklist-submit-btn"
            style={{ margin: 0, padding: "8px 16px", fontSize: "13px" }}
            onClick={() => navigate("/preencher-checklist")}
          >
            + Preencher Nova Checklist
          </button>
        </div>

        {checklists.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Nenhum checklist de sintomas registrado.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {checklists.map((ch) => (
              <div
                key={ch.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "bold" }}>
                    Checklist de Sintomas ({ch.sintomas_selecionados?.length || 0} sintomas identificados)
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(ch.data_preenchimento).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(ch.data_preenchimento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginBottom: "8px" }}>
                  <strong>Preenchido por:</strong> {ch.preenchido_por}
                </div>
                {ch.sintomas_selecionados && ch.sintomas_selecionados.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ch.sintomas_selecionados.map((idSintoma: number) => (
                      <span
                        key={idSintoma}
                        style={{
                          background: "#e0e7ff",
                          color: "#3730a3",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {sintomasMap[idSintoma] || `Sintoma #${idSintoma}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Histórico de Consultas */}
        <div className="dashboard-med-registration">
          <h3
            style={{
              fontSize: "18px",
              color: "#1a3a6e",
              borderBottom: "2px solid rgba(26,95,168,0.1)",
              paddingBottom: "8px",
              marginBottom: "16px",
              fontWeight: "bold",
            }}
          >
            Histórico de Consultas
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", padding: 0 }}>
            <li style={{ fontSize: "13px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>Consulta Inicial de Triagem</strong>
                <br />
                <span style={{ color: "#888" }}>Instituto Buko Kaesemodel</span>
              </div>
              <span style={{ color: "#22c55e", fontWeight: "bold" }}>Concluída</span>
            </li>
            {paciente.id_medico_responsavel && (
              <li style={{ fontSize: "13px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>Consulta de Avaliação Clínica</strong>
                  <br />
                  <span style={{ color: "#888" }}>Dr. André Silva (Neurologista)</span>
                </div>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>Concluída</span>
              </li>
            )}
            <li style={{ fontSize: "13px", paddingBottom: "4px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>Retorno de Exames Genéticos</strong>
                <br />
                <span style={{ color: "#888" }}>A agendar após resultado da PCR</span>
              </div>
              <span style={{ color: "#ef4444", fontWeight: "bold" }}>Aguardando Exame</span>
            </li>
          </ul>
        </div>

        {/* Suporte e Contatos Úteis */}
        <div
          className="dashboard-med-registration"
          style={{ background: "linear-gradient(to bottom right, #ffffff, #f0f7ff)" }}
        >
          <h3
            style={{
              fontSize: "18px",
              color: "#1a3a6e",
              borderBottom: "2px solid rgba(26,95,168,0.1)",
              paddingBottom: "8px",
              marginBottom: "16px",
              fontWeight: "bold",
            }}
          >
            Suporte e Contatos Úteis
          </h3>
          <p style={{ fontSize: "13px", color: "#475569", marginBottom: "16px", lineHeight: "1.5" }}>
            O Programa de Ajuda do Instituto Buko Kaesemodel oferece acolhimento e orientações sobre a Síndrome do X Frágil.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              type="button"
              className="patient-card-whatsapp-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                background: "#25D366",
                border: "none",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
              }}
              onClick={() => window.open("https://wa.me/5541999999999?text=Olá,%20gostaria%20de%20suporte%20sobre%20o%20Programa%20X%20Frágil", "_blank")}
            >
              Falar no WhatsApp Suporte
            </button>
            <div style={{ fontSize: "12px", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
              <div>
                📞 <strong>Instituto:</strong> (41) 3222-0000
              </div>
              <div>
                ✉ <strong>E-mail:</strong> contato@bukokaesemodel.org.br
              </div>
              <div>
                🌐 <strong>Guia Síndrome X Frágil:</strong>{" "}
                <a
                  href="https://xfragil.org.br/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1a5fa8", textDecoration: "underline" }}
                >
                  Acesse o Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
