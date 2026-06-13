import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

export default function AdminUsers() {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [editingUser, setEditingUser] = useState<Record<string, unknown> | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCpf, setEditCpf] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editStatus, setEditStatus] = useState<"PENDING_ACTIVATION" | "ACTIVE">("ACTIVE");
  const [editRole, setEditRole] = useState<"paciente" | "medico" | "instituto">("paciente");

  // Doctor fields
  const [editCrm, setEditCrm] = useState("");
  const [editEspecialidade, setEditEspecialidade] = useState("");
  const [editInstituicao, setEditInstituicao] = useState("");
  const [editCidade, setEditCidade] = useState("");
  const [editEstado, setEditEstado] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refreshUsers = async () => {
    try {
      const data = await api.get<Record<string, unknown>[]>("/users");
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleEditClick = (u: Record<string, unknown>) => {
    setEditingUser(u);
    setEditNome(u.nome);
    setEditEmail(u.email);
    setEditCpf(u.cpf);
    setEditTelefone(u.telefone || "");
    setEditStatus(u.status);
    setEditRole(u.role);

    if (u.role === "medico" && u.medicoDetails) {
      setEditCrm(u.medicoDetails.crm || "");
      setEditEspecialidade(u.medicoDetails.especialidade || "");
      setEditInstituicao(u.medicoDetails.instituicao || "");
      setEditCidade(u.medicoDetails.cidade || "");
      setEditEstado(u.medicoDetails.estado || "");
    } else {
      setEditCrm("");
      setEditEspecialidade("");
      setEditInstituicao("");
      setEditCidade("");
      setEditEstado("");
    }
    setError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!usuario) {
      setError("Ação não autorizada.");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        nome: editNome,
        email: editEmail,
        cpf: editCpf,
        telefone: editTelefone,
        status: editStatus,
        role: editRole,
      };

      if (editRole === "medico") {
        payload.crm = editCrm;
        payload.especialidade = editEspecialidade;
        payload.instituicao = editInstituicao;
        payload.cidade = editCidade;
        payload.estado = editEstado;
      }

      payload.adminUser = {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role || "admin",
      };

      await api.put(`/users/${editingUser.id}`, payload);

      setSuccess(`Usuário "${editNome}" atualizado com sucesso!`);
      setEditingUser(null);
      refreshUsers();

      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar usuário.");
    }
  };

  const handleDeleteClick = async (u: Record<string, unknown>) => {
    if (!usuario) return;
    if (u.id === usuario.id) {
      alert("Você não pode excluir sua própria conta atualmente logada.");
      return;
    }

    const confirm = window.confirm(
      `Tem certeza de que deseja excluir permanentemente o usuário "${u.nome}"? Esta ação removerá também seus registros de perfil.`,
    );
    if (confirm) {
      try {
        const payload = {
          adminUser: usuario,
        };
        await api.delete(`/users/${u.id}`, payload);
        setSuccess(`Usuário "${u.nome}" excluído com sucesso.`);
        refreshUsers();
        setTimeout(() => setSuccess(""), 4000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao excluir usuário.");
      }
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "Todos" || u.role === roleFilter;
    const matchesStatus = statusFilter === "Todos" || u.status === statusFilter;
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      u.nome.toLowerCase().includes(cleanSearch) ||
      u.email.toLowerCase().includes(cleanSearch) ||
      u.cpf.includes(cleanSearch) ||
      (u.medicoDetails?.crm && u.medicoDetails.crm.toLowerCase().includes(cleanSearch));

    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>Gerenciamento de Usuários</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
            Lista de todos os usuários do sistema. Ative, desative ou atualize informações conforme necessário.
          </p>
        </div>
      </div>

      {success && (
        <div
          style={{
            background: "rgba(82, 196, 26, 0.15)",
            border: "1px solid #52c41a",
            color: "#52c41a",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {success}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "rgba(255, 77, 79, 0.15)",
            border: "1px solid #ff4d4f",
            color: "#ff4d4f",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {error}
        </div>
      )}

      {/* Filters Card */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1 1 250px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#718096", marginBottom: "6px", textTransform: "uppercase" }}>
            Buscar
          </label>
          <input
            type="text"
            className="cadastro-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nome, E-mail, CPF ou CRM..."
            style={{ margin: 0 }}
          />
        </div>

        <div style={{ width: "180px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#718096", marginBottom: "6px", textTransform: "uppercase" }}>
            Perfil
          </label>
          <select
            className="cadastro-input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ margin: 0 }}
          >
            <option value="Todos">Todos</option>
            <option value="paciente">Paciente</option>
            <option value="medico">Médico</option>
            <option value="instituto">Instituto</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div style={{ width: "180px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#718096", marginBottom: "6px", textTransform: "uppercase" }}>
            Status
          </label>
          <select
            className="cadastro-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ margin: 0 }}
          >
            <option value="Todos">Todos</option>
            <option value="ACTIVE">Ativo</option>
            <option value="PENDING_ACTIVATION">Pendente de Ativação</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f7fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px" }}>Nome / Perfil</th>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px" }}>E-mail</th>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px" }}>CPF</th>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px" }}>Status</th>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px" }}>Detalhes Adicionais</th>
              <th style={{ padding: "16px 20px", fontWeight: "600", color: "#4a5568", fontSize: "14px", textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: "40px", textAlign: "center", color: "#718096" }}
                >
                  Nenhum usuário correspondente aos filtros foi encontrado.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, i) => {
                return (
                  <tr
                    key={u.id}
                    style={{ borderBottom: i < filteredUsers.length - 1 ? "1px solid #edf2f7" : "none" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "600", color: "#2d3748" }}>{u.nome}</div>
                      <div style={{ fontSize: "12px", color: "#718096", display: "flex", gap: "6px", marginTop: "2px" }}>
                        <span
                          style={{
                            background: u.role === "admin" ? "#fef3c7" : u.role === "medico" ? "#e0f2fe" : u.role === "instituto" ? "#dcfce7" : "#f3f4f6",
                            color: u.role === "admin" ? "#d97706" : u.role === "medico" ? "#0284c7" : u.role === "instituto" ? "#15803d" : "#4b5563",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            fontSize: "10px",
                          }}
                        >
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#4a5568", fontSize: "14px" }}>{u.email}</td>
                    <td style={{ padding: "16px 20px", color: "#4a5568", fontSize: "14px" }}>{u.cpf}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "12px",
                          fontWeight: "500",
                          color: u.status === "ACTIVE" ? "#2f855a" : "#c05621",
                          background: u.status === "ACTIVE" ? "#c6f6d5" : "#feebc8",
                          padding: "4px 8px",
                          borderRadius: "9999px",
                        }}
                      >
                        {u.status === "ACTIVE" ? "Ativo" : "Pendente de Ativação"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#718096", fontSize: "13px" }}>
                      {u.role === "medico" && u.medicoDetails && (
                        <div>
                          CRM: {u.medicoDetails.crm} | {u.medicoDetails.especialidade}
                          {u.medicoDetails.instituicao && <span style={{ display: "block", fontSize: "11px" }}>{u.medicoDetails.instituicao}</span>}
                          {(u.medicoDetails.cidade || u.medicoDetails.estado) && (
                            <span style={{ display: "block", fontSize: "11px", color: "#a0aec0" }}>
                              {u.medicoDetails.cidade} - {u.medicoDetails.estado}
                            </span>
                          )}
                        </div>
                      )}
                      {u.role === "paciente" && u.pacienteDetails && (
                        <div>
                          {u.pacienteDetails.cidade} - {u.pacienteDetails.estado}
                          <span style={{ display: "block", fontSize: "11px" }}>Responsável: {u.pacienteDetails.responsavel_nome}</span>
                        </div>
                      )}
                      {u.role === "instituto" && "Perfil Institucional"}
                      {u.role === "admin" && "Administrador Geral"}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEditClick(u)}
                          style={{
                            background: "#edf2f7",
                            border: "none",
                            color: "#4a5568",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600",
                            transition: "background 0.2s",
                          }}
                        >
                          Editar
                        </button>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteClick(u)}
                            style={{
                              background: "rgba(255, 77, 79, 0.15)",
                              border: "none",
                              color: "#ff4d4f",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600",
                              transition: "background 0.2s",
                            }}
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "650px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f7fafc",
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#2d3748", margin: 0 }}>Editar Perfil de Usuário</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#a0aec0",
                }}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSaveEdit}
              style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">Nome Completo</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    required
                  />
                </div>

                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">E-mail</label>
                  <input
                    type="email"
                    className="cadastro-input"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">CPF</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={editCpf}
                    onChange={(e) => setEditCpf(e.target.value)}
                    required
                  />
                </div>

                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">Telefone</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                  />
                </div>

                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">Status da Conta</label>
                  <select
                    className="cadastro-input"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "PENDING_ACTIVATION" | "ACTIVE")}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="PENDING_ACTIVATION">Pendente de Ativação</option>
                  </select>
                </div>

                <div
                  className="cadastro-item"
                  style={{ width: "100%" }}
                >
                  <label className="cadastro-label">Perfil / Função</label>
                  <select
                    className="cadastro-input"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as "paciente" | "medico" | "instituto")}
                  >
                    <option value="paciente">Paciente</option>
                    <option value="medico">Médico</option>
                    <option value="instituto">Instituto</option>
                  </select>
                </div>
              </div>

              {editRole === "medico" && (
                <div
                  style={{
                    borderTop: "1px solid #edf2f7",
                    paddingTop: "16px",
                    marginTop: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", margin: 0 }}>Informações Médicas Adicionais</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div
                      className="cadastro-item"
                      style={{ width: "100%" }}
                    >
                      <label className="cadastro-label">CRM</label>
                      <input
                        type="text"
                        className="cadastro-input"
                        value={editCrm}
                        onChange={(e) => setEditCrm(e.target.value)}
                        required={editRole === "medico"}
                      />
                    </div>
                    <div
                      className="cadastro-item"
                      style={{ width: "100%" }}
                    >
                      <label className="cadastro-label">Especialidade</label>
                      <input
                        type="text"
                        className="cadastro-input"
                        value={editEspecialidade}
                        onChange={(e) => setEditEspecialidade(e.target.value)}
                        required={editRole === "medico"}
                      />
                    </div>
                    <div
                      className="cadastro-item"
                      style={{ width: "100%" }}
                    >
                      <label className="cadastro-label">Instituição</label>
                      <input
                        type="text"
                        className="cadastro-input"
                        value={editInstituicao}
                        onChange={(e) => setEditInstituicao(e.target.value)}
                      />
                    </div>
                    <div
                      className="cadastro-item"
                      style={{ width: "100%" }}
                    >
                      <label className="cadastro-label">Cidade</label>
                      <input
                        type="text"
                        className="cadastro-input"
                        value={editCidade}
                        onChange={(e) => setEditCidade(e.target.value)}
                      />
                    </div>
                    <div
                      className="cadastro-item"
                      style={{ width: "100%" }}
                    >
                      <label className="cadastro-label">Estado (UF)</label>
                      <input
                        type="text"
                        className="cadastro-input"
                        value={editEstado}
                        onChange={(e) => setEditEstado(e.target.value)}
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "16px",
                  borderTop: "1px solid #edf2f7",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  className="hero-btn-secondary"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: "10px 20px", fontSize: "14px", margin: 0 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="checklist-submit-btn"
                  style={{ padding: "10px 20px", fontSize: "14px", width: "auto", margin: 0 }}
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
