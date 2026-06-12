import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import "./Sidebar.css";

interface UserInfo {
  name: string;
  photo?: string;
}

interface Props {
  role: string;
  user?: UserInfo;
  setView: (view: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type MenuOption = {
  id: string;
  label: string;
  roles: string[];
};

const MENU_OPTIONS: MenuOption[] = [
  // Admin
  { id: "audit-log", label: "Registro de Auditoria", roles: ["admin"] },
  { id: "manage-users", label: "Gerenciar Usuários", roles: ["admin"] },
  { id: "register-employee", label: "Cadastrar Funcionários", roles: ["admin"] },

  // Instituto
  { id: "reports", label: "Relatórios Estatísticos", roles: ["admin", "instituto"] },
  { id: "manage-medics", label: "Cadastrar Médicos", roles: ["admin", "instituto"] },
  { id: "all-patients", label: "Todos os Pacientes", roles: ["admin", "instituto"] },
  { id: "all-doctors", label: "Médicos Cadastrados", roles: ["admin", "instituto"] },
  { id: "approvals", label: "Aprovações Pendentes", roles: ["admin", "instituto"] },
  { id: "checklist-alerts", label: "Alertas de Checklist", roles: ["admin", "instituto"] },

  // Medico
  { id: "my-patients", label: "Meus Pacientes", roles: ["admin", "medico"] },
  { id: "register-patient", label: "Cadastrar Paciente", roles: ["admin", "medico", "instituto"] },
  { id: "fill-checklist", label: "Preencher Nova Checklist", roles: ["admin", "medico", "instituto"] },

  // Paciente
  { id: "my-history", label: "Meu Perfil", roles: ["admin", "paciente"] },
  { id: "link-requests", label: "Solicitações de Vínculo", roles: ["admin"] },
];

const Sidebar = ({ role, user, setView, onLogout, isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [checklistAlertCount, setChecklistAlertCount] = useState(0);

  const allowedOptions = MENU_OPTIONS.filter((option) => option.roles.includes(role));

  useEffect(() => {
    const fetchCount = () => {
      if (role === "instituto" || role === "admin") {
        api
          .get("/doctors/solicitacoes/count")
          .then((res: any) => {
            if (res && typeof res.count === "number") {
              setPendingCount(res.count);
            }
          })
          .catch((err) => console.error("Erro ao buscar solicitações pendentes:", err));
      }
    };

    const fetchChecklistAlertCount = () => {
      if (role === "instituto" || role === "admin") {
        api
          .get("/notificacoes-pcr/count")
          .then((res: any) => {
            if (res && typeof res.count === "number") {
              setChecklistAlertCount(res.count);
            }
          })
          .catch((err) => console.error("Erro ao buscar alertas de checklist:", err));
      }
    };

    fetchCount();
    fetchChecklistAlertCount();

    window.addEventListener("solicitacoesUpdated", fetchCount);
    window.addEventListener("checklistAlertsUpdated", fetchChecklistAlertCount);
    return () => {
      window.removeEventListener("solicitacoesUpdated", fetchCount);
      window.removeEventListener("checklistAlertsUpdated", fetchChecklistAlertCount);
    };
  }, [role]);

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header-mobile">
        <div className="sidebar-menu-title-container">
          <h2 className="sidebar-menu-title">MENU</h2>
        </div>
        {onClose && (
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Fechar Menu"
          >
            &times;
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-role-group">
          {allowedOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ backgroundColor: "var(--hover-bg, rgba(26,95,168,0.1))" }}
              whileTap={{ scale: 0.98 }}
              className="sidebar-btn"
              onClick={() => {
                setView(option.id);
                if (onClose) onClose();
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>{option.label}</span>
                {option.id === "approvals" && pendingCount > 0 && (
                  <span
                    style={{
                      background: "#e53e3e",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      marginLeft: "8px",
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
                {option.id === "checklist-alerts" && checklistAlertCount > 0 && (
                  <span
                    style={{
                      background: "#e53e3e",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      marginLeft: "8px",
                    }}
                  >
                    {checklistAlertCount}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </nav>

      <div className="sidebar-main-logo-container">
        <img
          src="/ibkblue.png.webp"
          alt="IBK Logo"
          className="sidebar-main-logo"
        />
      </div>

      <div className="sidebar-bottom-group">
        {user && (
          <div className="sidebar-user-profile">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="sidebar-user-avatar"
              />
            ) : (
              <div className="sidebar-user-avatar-fallback">{user.name.charAt(0).toUpperCase()}</div>
            )}
            <span className="sidebar-user-name">{user.name}</span>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="sidebar-btn"
          style={{ marginBottom: "8px" }}
        >
          Início
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="sidebar-btn logout"
        >
          Sair
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
