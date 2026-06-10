import React from 'react';
import { useLarguraJanela } from '../hooks/useHooks';
import AnimatedContent from './AnimatedContent';
import logoIBK from '/LOGO_IBK.png';

interface IconeSocialProps {
  d: string;
  etiqueta: string;
}
const IconeSocial = ({ d, etiqueta }: IconeSocialProps) => (
  <a
    href="#"
    aria-label={etiqueta}
    style={{
      color: "#a8c8d8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      borderRadius: "50%",
      transition: "background 0.2s ease, color 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#1a5fa8";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#a8c8d8";
    }}
  >
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  </a>
);

const LINKS_SOCIAIS = [
  {
    etiqueta: "Facebook",
    d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    etiqueta: "Instagram",
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  },
  {
    etiqueta: "LinkedIn",
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    etiqueta: "YouTube",
    d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02V8.98L15.5 12z",
  },
];

const Footer = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 600;

  const estiloCabecalhoCol = {
    fontSize: 13,
    fontWeight: 700,
    color: "#ffffff",
    borderBottom: "2px solid #4a9fd4",
    paddingBottom: 10,
    marginBottom: 16,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  };

  const colunas = [
    {
      titulo: "Eu Digo X",
      conteudo: (
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 48 }}>
          <img
            src={logoIBK}
            alt="Logo Eu Digo X"
            style={{
              width: "auto",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      ),
    },
    {
      titulo: "Links",
      conteudo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "A Síndrome do X Frágil",
            "Parceiros Eu Digo X",
            "Entre em Contato",
            "Política de Privacidade",
          ].map((label) => (
            <a
              key={label}
              href="#"
              style={{ fontSize: 13, color: "#d4e4f0", fontWeight: 500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#d4e4f0"; }}
            >
              {label}
            </a>
          ))}
        </div>
      ),
    },
    {
      titulo: "Redes Sociais",
      conteudo: (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {LINKS_SOCIAIS.map((s) => (
            <IconeSocial key={s.etiqueta} d={s.d} etiqueta={s.etiqueta} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <footer
      style={{
        background: "#0d2e5e",
        borderTop: "3px solid #1a5fa8",
        padding: "36px clamp(16px, 4vw, 40px) 28px",
        fontFamily: "'DM Sans', sans-serif",
      }}
      aria-label="Rodapé"
    >
      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15}>
        <div style={{
          display: "flex",
          justifyContent: ehMobile ? "center" : "space-between",
          flexDirection: ehMobile ? "column" : "row",
          flexWrap: "wrap",
          gap: 32,
          maxWidth: 900,
          margin: "0 auto",
          alignItems: ehMobile ? "center" : "flex-start",
          textAlign: ehMobile ? "center" : "left",
        }}>
          {colunas.map((col) => (
            <div key={col.titulo} style={{ minWidth: 140 }}>
              <div style={estiloCabecalhoCol}>{col.titulo}</div>
              {col.conteudo}
            </div>
          ))}
        </div>
      </AnimatedContent>

     
        <div style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          textAlign: "center",
          fontSize: 12,
          color: "#a8c8d8",
          letterSpacing: 0.3,
        }}>
          © {new Date().getFullYear()} Instituto Buko Kaesemodel. Todos os direitos reservados.
        </div>
    
    </footer>
  );
};

export default Footer;
