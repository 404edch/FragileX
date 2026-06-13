import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { User } from "../../types";
import { UsersFilters } from "./AdminUsers/UsersFilters";
import { UsersTable } from "./AdminUsers/UsersTable";
import { EditUserModal } from "./AdminUsers/EditUserModal";
import "./AdminUsers/AdminUsers.css";

export default function AdminUsers() {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refreshUsers = async () => {
    try {
      const data = await api.get<User[]>("/users");
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

  const handleSaveEdit = async (updatedData: Partial<User>) => {
    setError("");
    setSuccess("");

    if (!usuario) {
      setError("Ação não autorizada.");
      return;
    }

    if (!editingUser) return;

    try {
      const payload = {
        ...updatedData
      };

      await api.put(`/users/${editingUser.id}`, payload);

      setSuccess(`Usuário "${updatedData.nome}" atualizado com sucesso!`);
      setEditingUser(null);
      refreshUsers();

      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar usuário.");
    }
  };

  const handleDeleteClick = async (u: User) => {
    if (!usuario) return;
    if (String(u.id) === String(usuario.id)) {
      alert("Você não pode excluir sua própria conta atualmente logada.");
      return;
    }

    const confirm = window.confirm(
      `Tem certeza de que deseja excluir permanentemente o usuário "${u.nome}"? Esta ação removerá também seus registros de perfil.`,
    );
    if (confirm) {
      try {
        await api.delete(`/users/${u.id}`);
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
    <div className="admin-users-container">
      <div className="admin-users-header-container">
        <div className="admin-users-header-wrapper">
          <h2 className="admin-users-title">Gerenciamento de Usuários</h2>
          <p className="admin-users-subtitle">
            Lista de todos os usuários do sistema. Ative, desative ou atualize informações conforme necessário.
          </p>
        </div>
      </div>

      {success && (
        <div className="admin-users-alert-success">
          {success}
        </div>
      )}

      {error && (
        <div className="admin-users-alert-error">
          {error}
        </div>
      )}

      <UsersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <UsersTable
        users={filteredUsers}
        onEdit={setEditingUser}
        onDelete={handleDeleteClick}
      />

      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
