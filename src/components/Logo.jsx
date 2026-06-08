import React from 'react';
import logoGif from './logo.gif';
import SplitText from './SplitText';

export const LogoGif = () => (
  <img
    src={logoGif}
    alt="Logo Eu Digo X"
    style={{
      width: "auto",
      height: "100%",
      objectFit: "contain",
      display: "block",
    }}
    onError={(e) => { e.target.style.display = "none"; }}
  />
);

export const LogoTexto = ({ pequeno = false }) => (
  <div style={{
    lineHeight: 1,
    fontFamily: "'DM Serif Display', serif",
    userSelect: "none",
    color: "#1a4a6e",
    display: "flex",
    alignItems: "center",
    gap: 12,
  }}>
    <SplitText
      text="Eu Digo "
      tag="span"
      className="logo-texto-main"
      delay={40}
      duration={2}
      ease="power3.out"
      splitType="chars"
      from={{ opacity: 0, y: pequeno ? 8 : 16 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.3}
      rootMargin="-50px"
      textAlign="left"
      style={{
        fontSize: pequeno ? 16 : 20,
        fontWeight: 700,
        letterSpacing: 0.3,
        display: "inline",
        textTransform: "uppercase",
        fontStyle: "italic",
      }}
    />
    <SplitText
      text="X"
      tag="span"
      className="logo-texto-x"
      delay={60}
      duration={2.5}
      ease="power3.out"
      splitType="chars"
      from={{ opacity: 0, y: pequeno ? -60 : -100 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.3}
      rootMargin="-50px"
      textAlign="center"
      style={{
        fontSize: pequeno ? 28 : 36,
        fontWeight: 800,
        letterSpacing: 0,
        display: "inline-block",
        textTransform: "uppercase",
        color: "#1a5fa8",
        fontStyle: "italic",
        fontVariant: "small-caps",
      }}
    />
  </div>
);

const Logo = ({ pequeno = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: "100%" }}>
    <LogoGif />
    <LogoTexto pequeno={pequeno} />
  </div>
);

export default Logo;
