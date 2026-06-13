import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { userService } from "../../services/userService";
import { doctorService } from "../../services/doctorService";
import { MockUsuario, MockMedico, MockPaciente } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";

export default function DoctorList() {
  const { usuario } = useAuth();
  const [doctors, setDoctors] = useState<(MockUsuario & { medicoDetails?: MockMedico })[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDoctor, setSelectedDoctor] = useState<MockUsuario | null>(null);
  const [doctorPatients, setDoctorPatients] = useState<(MockUsuario & { pacienteDetails?: MockPaciente })[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const users = await userService.listarTodosUsuarios();
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

  const handleDoctorClick = async (doc: MockUsuario) => {
    if (usuario?.role !== "instituto" && usuario?.role !== "admin") return;
    
    setSelectedDoctor(doc);
    setLoadingPatients(true);
    try {
      const patients = await doctorService.listarPacientesDoMedico(doc.id);
      setDoctorPatients(patients);
    } catch (err) {
      console.error("Erro ao buscar pacientes do médico:", err);
      setDoctorPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Carregando lista de médicos...</div>;
  }

  const canViewPatients = usuario?.role === "instituto" || usuario?.role === "admin";

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>Médicos Cadastrados</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>Lista de todos os médicos credenciados na plataforma.</p>
        {canViewPatients && (
          <p style={{ color: "#60a5fa", fontSize: "13px", marginTop: "4px" }}>Clique em um médico para ver os pacientes que ele tem acesso.</p>
        )}
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
              onClick={() => handleDoctorClick(doc)}
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
                cursor: canViewPatients ? "pointer" : "default",
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

      {selectedDoctor && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }} onClick={() => setSelectedDoctor(null)}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#1e293b" }}>Pacientes de {selectedDoctor.nome}</h3>
              <button onClick={() => setSelectedDoctor(null)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}>&times;</button>
            </div>
            
            {loadingPatients ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>Carregando pacientes...</p>
            ) : doctorPatients.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>Este médico não tem acesso a nenhum paciente.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {doctorPatients.map(p => (
                  <li key={p.id} style={{ padding: "12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold", color: "#334155" }}>{p.nome}</span>
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>CPF: {p.cpf}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
