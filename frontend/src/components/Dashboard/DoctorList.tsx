import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { backendService, type MockUsuario, type MockMedico } from "../../services/backendService";

export default function DoctorList() {
  const [doctors, setDoctors] = useState<(MockUsuario & { medicoDetails?: MockMedico })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const users = await backendService.listarTodosUsuarios();
        const medicos = users.filter((u) => u.role === "medico");
        setDoctors(medicos);
      } catch (err) {
        console.error("Erro ao buscar médicos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Carregando lista de médicos...</div>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a202c", marginBottom: "8px" }}>Médicos Cadastrados</h2>
        <p style={{ color: "#c5c9cf", fontSize: "14px" }}>Lista de todos os médicos credenciados na plataforma.</p>
      </div>

      {doctors.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", background: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#64748b" }}>
          Nenhum médico cadastrado no momento.
        </div>
      ) : (
        <AnimatePresence>
          {doctors.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "16px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: "6px solid #3b82f6",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#0f172a", fontWeight: "bold" }}>{doc.nome}</h3>
                <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#64748b" }}>
                  <span>
                    <strong>E-mail:</strong> {doc.email}
                  </span>
                  <span>
                    <strong>CRM:</strong> {doc.medicoDetails?.crm || "Não informado"}
                  </span>
                  <span>
                    <strong>Telefone:</strong> {doc.telefone || "Não informado"}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: doc.status === "ACTIVE" ? "#dcfce7" : "#fef3c7",
                    color: doc.status === "ACTIVE" ? "#166534" : "#92400e",
                  }}
                >
                  {doc.status === "ACTIVE" ? "Ativo" : "Pendente"}
                </span>
                <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#64748b" }}>{doc.medicoDetails?.especialidade || "Clínico Geral"}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
