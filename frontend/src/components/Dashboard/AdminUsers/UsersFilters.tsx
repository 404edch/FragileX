import React from "react";
import "./AdminUsers.css";

interface UsersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="admin-users-filters-card">
      <div className="admin-users-filter-group">
        <label className="admin-users-filter-label">Buscar</label>
        <input
          type="text"
          className="cadastro-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nome, E-mail, CPF ou CRM..."
          style={{ margin: 0 }}
        />
      </div>

      <div className="admin-users-filter-group-fixed">
        <label className="admin-users-filter-label">Perfil</label>
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

      <div className="admin-users-filter-group-fixed">
        <label className="admin-users-filter-label">Status</label>
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
  );
};
