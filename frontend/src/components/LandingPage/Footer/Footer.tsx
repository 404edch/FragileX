import React from 'react';
import { useLarguraJanela } from '../../../hooks/useHooks';
import AnimatedContent from '../../Shared/AnimatedContent';
import logoIBK from '/LOGO_IBK.png';
import './Footer.css';

interface IconeSocialProps {
  d: string;
  etiqueta: string;
  href: string;
}

const IconeSocial = ({ d, etiqueta, href }: IconeSocialProps) => (
  <a
    href={href}
    aria-label={etiqueta}
    className="footer-social-icon"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  </a>
);

const LINKS_SOCIAIS = [
  {
    etiqueta: "Facebook",
    href: "https://facebook.com",
    d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    etiqueta: "Instagram",
    href: "https://instagram.com",
    d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  },
  {
    etiqueta: "LinkedIn",
    href: "https://linkedin.com",
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    etiqueta: "YouTube",
    href: "https://youtube.com",
    d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02V8.98L15.5 12z",
  },
];

const LINKS_FOOTER = [
  {
    label: "O Instituto Buko Kaesemodel",
    href: "https://institutobk.org.br/",
  },
  {
    label: "Parceiros Eu Digo X",
    href: "https://institutobk.org.br/parceiros-e-apoiadores/",
  },
  {
    label: "Nossa História",
    href: "https://institutobk.org.br/o_instituto_buko_kaesemodel/#nossa_historia",
  },
  {
    label: "Eventos",
    href: "https://institutobk.org.br/eventos-2/",
  },
];

const Footer = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 600;

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
      titulo: "Links Úteis", // Adicionado o título que faltava
      conteudo: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LINKS_FOOTER.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {link.label}
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
            <IconeSocial 
              key={s.etiqueta} 
              d={s.d} 
              etiqueta={s.etiqueta} 
              href={s.href} // Corrigido: passando a prop href que faltava
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <footer
      className="footer-container"
      aria-label="Rodapé"
    >
      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15}>
        <div className={`footer-content ${ehMobile ? 'footer-mobile' : 'footer-desktop'}`}>
          {colunas.map((col) => (
            <div key={col.titulo} style={{ minWidth: 140 }}>
              <div className="footer-col-title">{col.titulo}</div>
              {col.conteudo}
            </div>
          ))}
        </div>
      </AnimatedContent>

      <div className="footer-copyright">
        © {new Date().getFullYear()} Instituto Buko Kaesemodel. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;