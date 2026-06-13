import React from "react";
import "../PatientDashboard.css";

interface SupportContactsSectionProps {
  usuario: any;
}

const SupportContactsSection: React.FC<SupportContactsSectionProps> = ({ usuario }) => {
  if (usuario?.role === "admin" || usuario?.role === "instituto") {
    return null;
  }

  return (
    <div className="dashboard-med-registration patient-support-section">
      <h3 className="patient-section-header">Suporte e Contatos Úteis</h3>
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
        <div className="patient-support-contacts">
          <div>
            📞 <strong>Fixo:</strong>{" "}
            <a
              href="tel:+554131560309"
              className="patient-support-link"
            >
              (41) 3156-0309
            </a>
          </div>
          <div>
            ✉ <strong>E-mail:</strong>{" "}
            <a
              href="mailto:contato@institutobk.org.br"
              className="patient-support-link"
            >
              contato@institutobk.org.br
            </a>
          </div>
          <div>
            📍 <strong>Endereço:</strong>{" "}
            <a
              href="https://maps.app.goo.gl/FDVXQcNtnsnnVAH98"
              target="_blank"
              rel="noreferrer"
              className="patient-support-link"
            >
              Rua Fernando Simas, 172 – Curitiba-PR
            </a>
          </div>
          <div>
            🌐 <strong>Guia Síndrome X Frágil:</strong>{" "}
            <a
              href="https://eudigox.com.br/"
              target="_blank"
              rel="noreferrer"
              className="patient-support-link"
              style={{ textDecoration: "underline" }}
            >
              Acesse o Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportContactsSection;
