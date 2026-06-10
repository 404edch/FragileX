import React from 'react';
import { ESPACAMENTO_CARD } from '../../constants/constantes';

/**
 * Estilos globais da aplicação injetados via tag <style>
 */
const EstilosGlobais = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #fff;
      -webkit-font-smoothing: antialiased;
    }

    button {
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
    }

    a { text-decoration: none; }

    /* ── Estilos de foco para acessibilidade ── */
    :focus-visible {
      outline: 2.5px solid #1a5fa8;
      outline-offset: 3px;
      border-radius: 4px;
    }

    /* ── Animações Keyframe ── */
    @keyframes crescer {
      from { opacity: 0; transform: scale(0.75); }
      to   { opacity: 1; transform: scale(1); }
    }

    @keyframes subir {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes entrarLado {
      from { opacity: 0; transform: translateX(32px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    @keyframes abrirMenu {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes entrarCard {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ── Classes de animação aplicadas ── */
    .anim-subir {
      animation: subir 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .anim-crescer {
      animation: crescer 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    .anim-card-entrada {
      animation: entrarCard 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── Efeito de levantar o card no hover — apenas dispositivos com mouse ── */
    @media (hover: hover) {
      .carousel-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 32px rgba(20, 60, 120, 0.18) !important;
      }
    }

    /* ── Trilho do carrossel (swipe mobile) ── */
    .carousel-track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      gap: ${ESPACAMENTO_CARD}px;
      padding: 8px 0 16px;
    }
    .carousel-track::-webkit-scrollbar { display: none; }

    .carousel-track .carousel-card {
      scroll-snap-align: center;
      flex-shrink: 0;
    }

    /* ── Animação do Hamburger ── */
    .hamburger-line {
      display: block;
      width: 22px;
      height: 2px;
      background: #333;
      border-radius: 2px;
      transition: transform 0.28s ease, opacity 0.28s ease;
      transform-origin: center;
    }
    .hamburger-aberto .line-top    { transform: translateY(7px) rotate(45deg); }
    .hamburger-aberto .line-mid    { opacity: 0; transform: scaleX(0); }
    .hamburger-aberto .line-bot    { transform: translateY(-7px) rotate(-45deg); }

    /* ── Painel do menu mobile ── */
    .mobile-menu {
      animation: abrirMenu 0.22s ease both;
    }

    /* ── Container de transição do carrossel ── */
    .slide-viewport {
      overflow: hidden;
      position: relative;
    }

    /* ── Auxiliares responsivos ── */
    @media (max-width: 767px) {
      .apenas-desktop { display: none !important; }
    }
    @media (min-width: 768px) {
      .apenas-mobile { display: none !important; }
    }
  `}</style>
);

export default EstilosGlobais;
