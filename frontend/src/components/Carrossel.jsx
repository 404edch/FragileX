import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LARGURA_CARD, ESPACAMENTO_CARD } from '../constants/constantes';
import { useLarguraJanela, useUmaVezNoViewport } from '../hooks/useHooks';

/**
 * Imagem de Placeholder para os cards
 */
export const ImagemPlaceholder = ({ etiqueta }) => (
  <div
    aria-label={etiqueta}
    style={{
      width: "100%",
      height: 160,
      background: "linear-gradient(135deg, #c8d8ea 0%, #d8e8f4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6a8caa",
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0.3,
    }}
  >
    {etiqueta}
  </div>
);

/**
 * Card individual do carrossel
 */
export const CardCarrossel = ({ nome, etiquetaImg, estilo: estiloExtra }) => (
  <article
    className="carousel-card"
    style={{
      width: LARGURA_CARD,
      background: "#ffffff",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(20,60,120,0.09)",
      overflow: "hidden",
      flexShrink: 0,
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      ...estiloExtra,
    }}
  >
    <div style={{
      padding: "12px 16px",
      fontSize: 13,
      fontWeight: 600,
      color: "#1a4a6e",
      borderBottom: "1px solid #e8f0f8",
    }}>
      {nome}
    </div>
    <ImagemPlaceholder etiqueta={etiquetaImg} />
  </article>
);

/**
 * Botão de seta para navegação
 */
const BotaoSeta = ({ direcao, onClick, desativado, etiqueta }) => (
  <button
    onClick={onClick}
    disabled={desativado}
    aria-label={etiqueta}
    style={{
      background: desativado ? "#f0f4f8" : "#ffffff",
      border: "1.5px solid",
      borderColor: desativado ? "#dde5ef" : "#1a5fa8",
      borderRadius: "50%",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      cursor: desativado ? "default" : "pointer",
      color: desativado ? "#bcc8d8" : "#1a5fa8",
      fontSize: 20,
      lineHeight: 1,
      transition: "background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
      boxShadow: desativado ? "none" : "0 2px 8px rgba(26,95,168,0.12)",
    }}
    onMouseEnter={(e) => {
      if (!desativado) {
        e.currentTarget.style.background = "#1a5fa8";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "scale(1.07)";
      }
    }}
    onMouseLeave={(e) => {
      if (!desativado) {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.color = "#1a5fa8";
        e.currentTarget.style.transform = "";
      }
    }}
  >
    {direcao === "esquerda" ? "‹" : "›"}
  </button>
);

/**
 * Carrossel para Desktop com navegação por setas
 */
export const CarrosselDesktop = ({ cards }) => {
  const larguraJanela = useLarguraJanela();
  const [offset, setOffset] = useState(0);
  const [animando, setAnimando] = useState(false);

  const PADDING_SECAO = 24;
  const LARGURA_CONTROLES = (40 * 2) + (16 * 2);

  const larguraDisponivel = Math.max(
    larguraJanela - PADDING_SECAO * 2 - LARGURA_CONTROLES,
    LARGURA_CARD + ESPACAMENTO_CARD
  );

  const visiveisCount = useMemo(() => {
    return Math.max(
      1,
      Math.floor((larguraDisponivel + ESPACAMENTO_CARD) / (LARGURA_CARD + ESPACAMENTO_CARD))
    );
  }, [larguraDisponivel]);

  const larguraPasso = LARGURA_CARD + ESPACAMENTO_CARD;
  const offsetMaximo = Math.max(0, (cards.length - visiveisCount) * larguraPasso);

  useEffect(() => {
    setOffset((prev) => Math.min(prev, offsetMaximo));
  }, [offsetMaximo]);

  const podeVoltar = offset > 0;
  const podeAvancar = offset < offsetMaximo;

  const navegar = useCallback((dir) => {
    if (animando) return;
    setAnimando(true);
    setOffset((prev) => {
      const proximo = dir === "direita"
        ? Math.min(prev + visiveisCount * larguraPasso, offsetMaximo)
        : Math.max(prev - visiveisCount * larguraPasso, 0);
      return proximo;
    });
    setTimeout(() => setAnimando(false), 380);
  }, [animando, visiveisCount, larguraPasso, offsetMaximo]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
      <BotaoSeta
        direcao="esquerda"
        onClick={() => navegar("esquerda")}
        desativado={!podeVoltar}
        etiqueta="Anterior"
      />

      <div className="slide-viewport" style={{ flex: 1 }} aria-live="polite" aria-label="Carrossel de cards">
        <div
          style={{
            display: "flex",
            gap: ESPACAMENTO_CARD,
            transform: `translateX(-${offset}px)`,
            transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
        >
          {cards.map((card) => (
            <CardCarrossel
              key={card.id}
              nome={card.nome}
              etiquetaImg={card.etiquetaImg}
            />
          ))}
        </div>
      </div>

      <BotaoSeta
        direcao="direita"
        onClick={() => navegar("direita")}
        desativado={!podeAvancar}
        etiqueta="Próximo"
      />
    </div>
  );
};

/**
 * Carrossel para Mobile com scroll nativo
 */
export const CarrosselMobile = ({ cards }) => {
  const trilhoRef = useRef(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;

    const tratarScroll = () => {
      const scrollEsquerda = trilho.scrollLeft;
      const larguraCliente = trilho.clientWidth - 40;
      const indice = Math.round(scrollEsquerda / (larguraCliente + ESPACAMENTO_CARD));
      setIndiceAtivo(Math.max(0, Math.min(indice, cards.length - 1)));
    };

    trilho.addEventListener("scroll", tratarScroll, { passive: true });
    return () => trilho.removeEventListener("scroll", tratarScroll);
  }, [cards.length]);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={trilhoRef}
        className="carousel-track"
        role="region"
        aria-label="Carrossel de cards — deslize para navegar"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        {cards.map((card) => (
          <CardCarrossel
            key={card.id}
            nome={card.nome}
            etiquetaImg={card.etiquetaImg}
            estilo={{ width: "calc(100vw - 60px)", maxWidth: 320 }}
          />
        ))}
      </div>

      <div role="tablist" aria-label="Indicadores de posição" style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 4 }}>
        {cards.map((_, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === indiceAtivo}
            aria-label={`Card ${i + 1} de ${cards.length}`}
            style={{
              width: i === indiceAtivo ? 18 : 8,
              height: 8,
              borderRadius: 4,
              background: i === indiceAtivo ? "#1a5fa8" : "#c0d4e8",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};
