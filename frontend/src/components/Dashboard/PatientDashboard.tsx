import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { backendService, type MockConsulta } from "../../services/backendService";
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
  const { atualizarUsuarioLogado, usuario } = useAuth();
  const [paciente, setPaciente] = useState<PacienteReal | null>(null);
  const [checklists, setChecklists] = useState<ChecklistPaciente[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<VinculoPaciente[]>([]);
  const [notas, setNotas] = useState<MockConsulta[]>([]);
  const [novaNota, setNovaNota] = useState("");
  const [enviandoNota, setEnviandoNota] = useState(false);
  const [fotosGaleria, setFotosGaleria] = useState<any[]>([]);
  const [currentFotoIndex, setCurrentFotoIndex] = useState(0);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [usuarioInfo, setUsuarioInfo] = useState<UsuarioReal | null>(null);
  const [medicoResponsavelText, setMedicoResponsavelText] = useState<string>("Buscando...");
  const [sintomasMap, setSintomasMap] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editandoNotaId, setEditandoNotaId] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  const iniciarEdicaoNota = (nota: MockConsulta) => {
    setEditandoNotaId(nota.id);
    setTextoEdicao(nota.observacoes);
  };

  const cancelarEdicaoNota = () => {
    setEditandoNotaId(null);
    setTextoEdicao("");
  };

  const salvarEdicaoNota = async (idNota: number) => {
    if (!textoEdicao.trim()) return;
    try {
      await backendService.atualizarNota(idNota, textoEdicao);
      const notasAtualizadas = await backendService.listarNotasPaciente(idUsuario);
      setNotas(notasAtualizadas);
      setEditandoNotaId(null);
    } catch (err) {
      console.error("Erro ao atualizar nota", err);
      alert("Erro ao atualizar nota");
    }
  };

  const handleDeletarNota = async (idNota: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta nota?")) return;
    try {
      await backendService.deletarNota(idNota);
      const notasAtualizadas = await backendService.listarNotasPaciente(idUsuario);
      setNotas(notasAtualizadas);
    } catch (err) {
      console.error("Erro ao deletar nota", err);
      alert("Erro ao excluir nota");
    }
  };

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

      const [checklistsData, sintomasList, solicitacoesData, notasData] = await Promise.all([
        backendService.obterChecklistsPaciente(idUsuario).catch(() => [] as ChecklistPaciente[]),
        getSintomas().catch(() => []),
        backendService.listarSolicitacoesVinculoPaciente(idUsuario).catch(() => [] as VinculoPaciente[]),
        backendService.listarNotasPaciente(idUsuario).catch(() => [] as MockConsulta[]),
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


  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsUploadingFoto(true);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await backendService.atualizarFotoPerfil(idUsuario, base64);
        if (paciente) {
          setPaciente({ ...paciente, foto_perfil: base64 });
        }
      } catch (err) {
        alert("Erro ao enviar foto");
      } finally {
        setIsUploadingFoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

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

  const handleCycleStatus = async () => {
    if (usuarioInfo?.role !== "instituto") return;

    let nextStatus = "pendente";
    if (paciente.encaminhamento_status === "pendente") nextStatus = "encaminhado";
    else if (paciente.encaminhamento_status === "encaminhado") nextStatus = "encaminhamento negado";
    else nextStatus = "pendente";

    try {
      await backendService.updatePatientStatus(paciente.id_usuario, nextStatus);
      if (paciente) {
        setPaciente({ ...paciente, encaminhamento_status: nextStatus as any });
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (status === "encaminhado") return { bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.3)", text: "#16a34a" };
    if (status === "encaminhamento negado") return { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444" };
    return { bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.3)", text: "#ca8a04" }; // pendente
  };

  const statusColors = getStatusColor(paciente.encaminhamento_status);

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
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* FOTO DO PERFIL */}
            <div style={{ flexShrink: 0 }}>
              {paciente.foto_perfil ? (
                <img
                  src={paciente.foto_perfil}
                  alt="Foto do Paciente"
                  style={{ width: "140px", height: "140px", borderRadius: "10px", objectFit: "cover", border: "3px solid #1a5fa8" }}
                />
              ) : (
                <div style={{ width: "140px", height: "140px", borderRadius: "10px", border: "3px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                  Sem Foto
                </div>
              )}
            </div>
            
            {/* DADOS PESSOAIS */}
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

            {usuario?.role === "instituto" ? (
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: "bold", marginBottom: "4px" }}>
                  Status Atual do Processo ✏️
                </span>
                <select
                  value={paciente.encaminhamento_status}
                  onChange={async (e) => {
                    const nextStatus = e.target.value;
                    try {
                      await backendService.updatePatientStatus(paciente.id_usuario, nextStatus);
                      setPaciente({ ...paciente, encaminhamento_status: nextStatus as any });
                    } catch (err) {
                      console.error("Erro ao atualizar status:", err);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "10px",
                    border: `1px solid ${statusColors.border}`,
                    background: statusColors.bg,
                    color: statusColors.text,
                    fontSize: "18px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    outline: "none",
                    textAlign: "center",
                    appearance: "menulist",
                  }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="encaminhado">Encaminhado</option>
                  <option value="encaminhamento negado">Não Encaminhado</option>
                </select>
              </div>
            ) : (
              <div
                style={{
                  background: statusColors.bg,
                  border: `1px solid ${statusColors.border}`,
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
                    color: statusColors.text,
                    textTransform: "uppercase",
                  }}
                >
                  {paciente.encaminhamento_status === "encaminhado"
                    ? "Encaminhado"
                    : paciente.encaminhamento_status === "encaminhamento negado"
                      ? "Não Encaminhado"
                      : "Pendente"}
                </strong>
              </div>
            )}

            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
              {paciente.encaminhamento_status === "encaminhado"
                ? "Com base no checklist preenchido, os critérios clínicos foram atendidos. O encaminhamento do exame genético de PCR de X Frágil foi emitido."
                : paciente.encaminhamento_status === "encaminhamento negado"
                  ? "Com base no checklist, os sintomas indicam paciente não afetado no momento."
                  : "Você precisa ter um checklist preenchido pelo médico ou instituto para avaliar os sintomas e emitir o encaminhamento ao exame molecular."}
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
      <div
        className="dashboard-med-registration"
        style={{ border: solicitacoes.length > 0 ? "2px solid #1a5fa8" : "1px solid #e2e8f0" }}
      >
        <h3
          style={{
            fontSize: "18px",
            color: solicitacoes.length > 0 ? "#1a5fa8" : "#1a3a6e",
            marginBottom: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>🔔</span> Solicitações de Vínculo Médico
        </h3>

        <div
          style={{
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "10px",
            color: "#64748b",
            fontSize: "14px",
            border: "1px dashed #cbd5e1",
            marginBottom: solicitacoes.length > 0 ? "16px" : "0",
          }}
        >
          Caso você tenha um médico que acompanha seu caso, quando ele te importar a solicitação aparecerá aqui.
        </div>

        {solicitacoes.length > 0 && (
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
        )}
      </div>

      {/* Seção 2: CHECKLISTS */}
      <div className="dashboard-med-registration">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h3 style={{ fontSize: "18px", color: "#1a3a6e", margin: 0, fontWeight: "bold" }}>Histórico de Checklists</h3>
          <button
            type="button"
            className="checklist-submit-btn"
            style={{ margin: 0, padding: "8px 16px", fontSize: "13px" }}
            onClick={() => navigate(`/preencher-checklist?cpf=${usuarioInfo.cpf}`)}
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
                  <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    Checklist de Sintomas ({ch.sintomas_selecionados?.length || 0} sintomas identificados)
                    {ch.classificacao && (
                      <span
                        style={{
                          background: ch.classificacao === "Suspeito" ? "#fef2f2" : "#ecfdf5",
                          color: ch.classificacao === "Suspeito" ? "#ef4444" : "#10b981",
                          border: `1px solid ${ch.classificacao === "Suspeito" ? "#fecaca" : "#a7f3d0"}`,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        {ch.classificacao === "Suspeito" ? "⚠️ Suspeito" : "✅ Negativo"}
                      </span>
                    )}
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
        {/* Histórico de Consultas / Notas */}
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
            Histórico de Consultas / Notas
          </h3>

          {(usuario?.role === "medico" || usuario?.role === "instituto") && (
            <div style={{ marginBottom: "24px", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#334155", marginBottom: "8px" }}>Adicionar Nova Nota</label>
              <textarea
                value={novaNota}
                onChange={(e) => setNovaNota(e.target.value)}
                placeholder="Digite as anotações da consulta ou acompanhamento..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  minHeight: "100px",
                  resize: "vertical",
                  marginBottom: "12px",
                }}
              />
              <button
                disabled={enviandoNota || !novaNota.trim()}
                onClick={async () => {
                  if (!novaNota.trim() || !usuario) return;
                  setEnviandoNota(true);
                  try {
                    await backendService.adicionarNota(paciente.id_usuario, novaNota, usuario.id, usuario.nome || "Usuário", usuario.role || "paciente");
                    setNovaNota("");
                    const notasAtualizadas = await backendService.listarNotasPaciente(paciente.id_usuario);
                    setNotas(notasAtualizadas);
                  } catch (err) {
                    console.error("Erro ao adicionar nota", err);
                  } finally {
                    setEnviandoNota(false);
                  }
                }}
                style={{
                  padding: "10px 16px",
                  background: "#1a5fa8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: enviandoNota || !novaNota.trim() ? "not-allowed" : "pointer",
                  opacity: enviandoNota || !novaNota.trim() ? 0.7 : 1,
                  transition: "background 0.2s",
                }}
              >
                {enviandoNota ? "Salvando..." : "Salvar Nota"}
              </button>
            </div>
          )}

          {notas.length === 0 ? (
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                textAlign: "center",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "10px",
                border: "1px dashed #cbd5e1",
              }}
            >
              Nenhuma consulta ou nota registrada até o momento.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <strong style={{ fontSize: "16px", color: "#0f172a" }}>{nota.titulo}</strong>
                      <span
                        style={{ fontSize: "12px", background: "#e0e7ff", color: "#3730a3", padding: "4px 10px", borderRadius: "12px", fontWeight: "bold" }}
                      >
                        Autor: {nota.autor_nome} ({nota.role_autor})
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", background: "#f1f5f9", padding: "4px 10px", borderRadius: "12px" }}>
                        {new Date(nota.data_consulta).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                      {(usuario?.role === "admin" || usuario?.role === "instituto" || usuario?.id === nota.autor_id) && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          {editandoNotaId === nota.id ? (
                            <>
                              <button
                                onClick={() => salvarEdicaoNota(nota.id)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  background: "#10b981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                }}
                              >
                                Salvar
                              </button>
                              <button
                                onClick={cancelarEdicaoNota}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  background: "#64748b",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                }}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => iniciarEdicaoNota(nota)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  background: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeletarNota(nota.id)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  background: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                }}
                              >
                                Excluir
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {editandoNotaId === nota.id ? (
                    <textarea
                      value={textoEdicao}
                      onChange={(e) => setTextoEdicao(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #3b82f6",
                        fontSize: "14px",
                        outline: "none",
                        minHeight: "80px",
                        resize: "vertical",
                        background: "#f8fafc",
                        fontFamily: "inherit",
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#334155",
                        whiteSpace: "pre-wrap",
                        margin: 0,
                        lineHeight: "1.6",
                        background: "#f8fafc",
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      {nota.observacoes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suporte e Contatos Úteis */}
        {usuario?.role !== "admin" && usuario?.role !== "instituto" && (
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
                  cursor: "pointer",
                }}
                onClick={() => window.open("https://wa.me/5541991034847?text=Olá,%20gostaria%20de%20suporte%20sobre%20o%20Programa%20X%20Frágil", "_blank")}
              >
                Falar no WhatsApp Suporte
              </button>
              <div style={{ fontSize: "12px", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                <div>
                  📞 <strong>Fixo:</strong> <a href="tel:+554131560309" style={{ color: "#1a5fa8", textDecoration: "none" }}>(41) 3156-0309</a>
                </div>
                <div>
                  ✉ <strong>E-mail:</strong> <a href="mailto:contato@institutobk.org.br" style={{ color: "#1a5fa8", textDecoration: "none" }}>contato@institutobk.org.br</a>
                </div>
                <div>
                  📍 <strong>Endereço:</strong> <a href="https://maps.app.goo.gl/FDVXQcNtnsnnVAH98" target="_blank" rel="noreferrer" style={{ color: "#1a5fa8", textDecoration: "none" }}>Rua Fernando Simas, 172 – Curitiba-PR</a>
                </div>
                <div>
                  🌐 <strong>Guia Síndrome X Frágil:</strong>{" "}
                  <a
                    href="https://eudigox.com.br/"
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
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
