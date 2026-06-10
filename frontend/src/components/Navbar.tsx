import React, { useState, useEffect, useCallback } from 'react';
import { ALTURA_NAVBAR } from '../constants/constantes';
import { useLarguraJanela } from '../hooks/useHooks';
import Logo from './Logo';
import AnimatedContent from './AnimatedContent';

/**
 * Botão Hamburger responsivo para navegação mobile
 * @param {Object} props - { aberto, onClick }
 * @returns {JSX.Element}
 */
interface BotaoHamburgerProps {
  aberto: boolean;
  onClick: () => void;
}
const BotaoHamburger = ({ aberto, onClick }: BotaoHamburgerProps) => (
  <button
    onClick={onClick}
    aria-label={aberto ? "Fechar menu" : "Abrir menu"}
    aria-expanded={aberto}
    aria-controls="mobile-nav"
    style={{
      background: "none",
      border: "none",
      padding: "6px",
      display: "flex",
      flexDirection: "column",
      gap: 5,
      alignItems: "center",
      justifyContent: "center",
      width: 38,
      height: 38,
      borderRadius: 6,
      cursor: "pointer",
      transition: "background 0.2s ease, transform 0.2s ease",
    }}
    className={aberto ? "hamburger-aberto" : ""}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(26, 95, 168, 0.1)";
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "none";
      e.currentTarget.style.transform = "";
    }}
  >
    {/* Três linhas do ícone hamburger */}
    <span className="hamburger-line line-top" />
    <span className="hamburger-line line-mid" />
    <span className="hamburger-line line-bot" />
  </button>
);

/**
 * Componente Navbar - Navegação principal da aplicação
 * Responsivo (desktop e mobile)
 * Integrado com sistema de autenticação
 * @param {Object} props - { onLoginClick, usuarioLogado, onLogout }
 * @returns {JSX.Element}
 */
interface NavbarProps {
  onLoginClick: () => void;
  usuarioLogado?: { email: string };
  onLogout: () => void;
}
const Navbar = ({ onLoginClick, usuarioLogado, onLogout }: NavbarProps) => {
  // Estados
  const [menuAberto, setMenuAberto] = useState(false);
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 768;

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    if (!ehMobile && menuAberto) setMenuAberto(false);
  }, [ehMobile, menuAberto]);

  const alternarMenu = useCallback(() => setMenuAberto((v) => !v), []);

  // Estilos reutilizáveis para links de navegação
  const estiloLinkNav: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: 13,
    color: "#444",
    letterSpacing: 1,
    fontWeight: 500,
    textTransform: "uppercase",
    padding: "4px 0",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "color 0.2s ease, transform 0.2s ease",
  };

  // Estilos do botão de login/usuário
  const estiloBotaoLogin = {
    base: {
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: 5,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 1,
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
    },
    hover: {
      background: "#1a5fa8",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(26, 95, 168, 0.3)",
    },
  };

  // Função para aplicar/remover estilos no botão de login
  const handleLoginMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    Object.assign(e.currentTarget.style, estiloBotaoLogin.hover);
  };

  const handleLoginMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "#111";
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "none";
  };

  // Texto do botão baseado no estado de autenticação
  const textoBotaoLogin = usuarioLogado 
    ? usuarioLogado.email.split('@')[0].toUpperCase() 
    : 'LOGIN';

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200 }}>
      <nav
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5eaf0",
          height: ALTURA_NAVBAR,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(16px, 3vw, 36px)",
          boxShadow: "0 1px 12px rgba(30,80,140,0.07)",
        }}
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="Início — Eu Digo X"
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <Logo pequeno={ehMobile} />
        </a>

        {/* Ações Desktop */}
        <div
          className="apenas-desktop"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          <AnimatedContent distance={20} direction="horizontal" duration={0.8} initialOpacity={0} animateOpacity>
            <button 
              style={estiloLinkNav}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1a5fa8";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#444";
                e.currentTarget.style.transform = "";
              }}
            >
              CONTATO
            </button>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="horizontal" duration={0.8} initialOpacity={0} animateOpacity delay={0.1}>
            <button 
              onClick={onLoginClick}
              style={{ ...estiloBotaoLogin.base, padding: "8px 22px" }}
              onMouseEnter={handleLoginMouseEnter}
              onMouseLeave={handleLoginMouseLeave}
            >
              {textoBotaoLogin}
            </button>
          </AnimatedContent>
        </div>

        {/* Hamburger Mobile */}
        <div className="apenas-mobile">
          <BotaoHamburger aberto={menuAberto} onClick={alternarMenu} />
        </div>
      </nav>

      {/* Painel Dropdown Mobile */}
      {ehMobile && menuAberto && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Menu mobile"
          className="mobile-menu"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5eaf0",
            boxShadow: "0 8px 24px rgba(30,80,140,0.10)",
            padding: "16px clamp(16px, 5vw, 32px) 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <AnimatedContent distance={30} direction="vertical" duration={0.8} initialOpacity={0} animateOpacity>
            <button 
              style={{
                ...estiloLinkNav,
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1a5fa8";
                e.currentTarget.style.transform = "translateX(0)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#444";
                e.currentTarget.style.transform = "";
              }}
            >
              CONTATO
            </button>
          </AnimatedContent>

          <div style={{ height: 1, background: "#edf2f7" }} />

          <AnimatedContent distance={30} direction="vertical" duration={0.8} initialOpacity={0} animateOpacity delay={0.1}>
            <button 
              onClick={onLoginClick}
              style={{
                ...estiloBotaoLogin.base,
                padding: "11px 24px",
                fontSize: 13,
                minWidth: 220,
                textAlign: "center",
              }}
              onMouseEnter={handleLoginMouseEnter}
              onMouseLeave={handleLoginMouseLeave}
            >
              {textoBotaoLogin}
            </button>
          </AnimatedContent>
        </div>
      )}
    </header>
  );
};

export default Navbar;
