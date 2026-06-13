import React, { useState } from "react";
import { User } from "../../../types";
import "./AdminUsers.css";

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (updatedData: Partial<User>) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>(() => {
    if (!user) return {};
    return {
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone || "",
      status: user.status,
      role: user.role,
      medicoDetails: user.medicoDetails
        ? { ...user.medicoDetails }
        : {
            crm: "",
            especialidade: "",
            instituicao: "",
            cidade: "",
            estado: "",
          },
    };
  });

  if (!user) return null;

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicalChange = (field: keyof NonNullable<User["medicoDetails"]>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medicoDetails: {
        ...(prev.medicoDetails || {}),
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-users-modal-overlay">
      <div className="admin-users-modal-content">
        <div className="admin-users-modal-header">
          <h3 className="admin-users-modal-title">Editar Perfil de Usuário</h3>
          <button
            type="button"
            onClick={onClose}
            className="admin-users-modal-close"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-users-modal-form"
        >
          <div className="admin-users-modal-grid">
            <div className="cadastro-item admin-users-input-wrapper">
              <label className="cadastro-label">Nome Completo</label>
              <input
                type="text"
                className="cadastro-input"
                value={formData.nome || ""}
                onChange={(e) => handleChange("nome", e.target.value)}
                required
              />
            </div>

            <div className="cadastro-item admin-users-input-wrapper">
              <label className="cadastro-label">E-mail</label>
              <input
                type="email"
                className="cadastro-input"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="cadastro-item admin-users-input-wrapper">
              <label className="cadastro-label">CPF</label>
              <input
                type="text"
                className="cadastro-input"
                value={formData.cpf || ""}
                onChange={(e) => handleChange("cpf", e.target.value)}
                required
              />
            </div>

            <div className="cadastro-item admin-users-input-wrapper">
              <label className="cadastro-label">Telefone</label>
              <input
                type="text"
                className="cadastro-input"
                value={formData.telefone || ""}
                onChange={(e) => handleChange("telefone", e.target.value)}
              />
            </div>

            {formData.role !== "admin" && (
              <>
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Status da Conta</label>
                  <select
                    className="cadastro-input"
                    value={formData.status || "ACTIVE"}
                    onChange={(e) => handleChange("status", e.target.value as User["status"])}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="PENDING_ACTIVATION">Pendente de Ativação</option>
                  </select>
                </div>

                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Perfil / Função</label>
                  <select
                    className="cadastro-input"
                    value={formData.role || "paciente"}
                    onChange={(e) => handleChange("role", e.target.value as User["role"])}
                  >
                    <option value="paciente">Paciente</option>
                    <option value="medico">Médico</option>
                    <option value="instituto">Instituto</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {formData.role === "medico" && (
            <div className="admin-users-modal-medical-group">
              <h4 className="admin-users-modal-medical-title">Informações Médicas Adicionais</h4>
              <div className="admin-users-modal-grid">
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">CRM</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={formData.medicoDetails?.crm || ""}
                    onChange={(e) => handleMedicalChange("crm", e.target.value)}
                    required={formData.role === "medico"}
                  />
                </div>
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Especialidade</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={formData.medicoDetails?.especialidade || ""}
                    onChange={(e) => handleMedicalChange("especialidade", e.target.value)}
                    required={formData.role === "medico"}
                  />
                </div>
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Instituição</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={formData.medicoDetails?.instituicao || ""}
                    onChange={(e) => handleMedicalChange("instituicao", e.target.value)}
                  />
                </div>
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Cidade</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={formData.medicoDetails?.cidade || ""}
                    onChange={(e) => handleMedicalChange("cidade", e.target.value)}
                  />
                </div>
                <div className="cadastro-item admin-users-input-wrapper">
                  <label className="cadastro-label">Estado (UF)</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    value={formData.medicoDetails?.estado || ""}
                    onChange={(e) => handleMedicalChange("estado", e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="admin-users-modal-footer">
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onClose}
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
  );
};
