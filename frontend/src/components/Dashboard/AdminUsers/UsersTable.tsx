import React from "react";
import { User } from "../../../types";
import "./AdminUsers.css";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="admin-users-table-card">
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Nome / Perfil</th>
            <th>E-mail</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Detalhes Adicionais</th>
            <th className="align-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="admin-users-table-empty">
                Nenhum usuário correspondente aos filtros foi encontrado.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              return (
                <tr key={u.id}>
                  <td>
                    <div className="admin-users-name">{u.nome}</div>
                    <div className="admin-users-role-wrapper">
                      <span className={`admin-users-role-badge ${u.role}`}>
                        {u.role}
                      </span>
                    </div>
                  </td>
                  <td className="admin-users-text">{u.email}</td>
                  <td className="admin-users-text">{u.cpf}</td>
                  <td>
                    <span className={`admin-users-status-badge ${u.status === "ACTIVE" ? "active" : "pending"}`}>
                      {u.status === "ACTIVE" ? "Ativo" : "Pendente de Ativação"}
                    </span>
                  </td>
                  <td className="admin-users-details-text">
                    {u.role === "medico" && u.medicoDetails && (
                      <div>
                        CRM: {u.medicoDetails.crm} | {u.medicoDetails.especialidade}
                        {u.medicoDetails.instituicao && <span className="admin-users-details-subtext">{u.medicoDetails.instituicao}</span>}
                        {(u.medicoDetails.cidade || u.medicoDetails.estado) && (
                          <span className="admin-users-details-subtext-light">
                            {u.medicoDetails.cidade} - {u.medicoDetails.estado}
                          </span>
                        )}
                      </div>
                    )}
                    {u.role === "paciente" && u.pacienteDetails && (
                      <div>
                        {u.pacienteDetails.cidade} - {u.pacienteDetails.estado}
                        <span className="admin-users-details-subtext">Responsável: {u.pacienteDetails.responsavel_nome}</span>
                      </div>
                    )}
                    {u.role === "instituto" && "Perfil Institucional"}
                    {u.role === "admin" && "Administrador Geral"}
                  </td>
                  <td className="align-right">
                    <div className="admin-users-actions-wrapper">
                      <button
                        className="admin-users-btn-edit"
                        onClick={() => onEdit(u)}
                      >
                        Editar
                      </button>
                      {u.role !== "admin" && (
                        <button
                          className="admin-users-btn-delete"
                          onClick={() => onDelete(u)}
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
  );
};
