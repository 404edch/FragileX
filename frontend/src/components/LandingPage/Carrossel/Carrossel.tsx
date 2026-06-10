import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LARGURA_CARD, ESPACAMENTO_CARD } from '../../../constants/constantes';
import { useLarguraJanela } from '../../../hooks/useHooks';
import './Carrossel.css';

interface ImagemPlaceholderProps {
  etiqueta: string;
}
export const ImagemPlaceholder = ({ etiqueta }: ImagemPlaceholderProps) => (
  <div aria-label={etiqueta} className="carousel-img-placeholder">
    {etiqueta}
  </div>
);

interface CardCarrosselProps {
  nome: string;
  etiquetaImg: string;
  estilo?: React.CSSProperties;
}
export const CardCarrossel = ({ nome, etiquetaImg, estilo: estiloExtra }: CardCarrosselProps) => (
  <article
    className="carousel-card"
    style={{
      width: LARGURA_CARD,
      ...estiloExtra,
    }}
  >
    <div className="carousel-card-title">
      {nome}
    </div>
    <ImagemPlaceholder etiqueta={etiquetaImg} />
  </article>
);

interface BotaoSetaProps {
  direcao: 'esquerda' | 'direita';
  onClick: () => void;
  desativado: boolean;
  etiqueta: string;
}
const BotaoSeta = ({ direcao, onClick, desativado, etiqueta }: BotaoSetaProps) => (
  <button
    onClick={onClick}
    disabled={desativado}
    aria-label={etiqueta}
    className={`carousel-arrow-btn ${desativado ? 'carousel-arrow-disabled' : ''}`}
  >
    {direcao === "esquerda" ? "‹" : "›"}
  </button>
);

interface CarrosselProps {
  cards: { id: number | string; nome: string; etiquetaImg: string }[];
}
export const CarrosselDesktop = ({ cards }: CarrosselProps) => {
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

  const navegar = useCallback((dir: 'esquerda' | 'direita') => {
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

      <div className="slide-viewport" style={{ flex: 1, overflow: 'hidden' }} aria-live="polite" aria-label="Carrossel de cards">
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
              estilo={{}}
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

export const CarrosselMobile = ({ cards }: CarrosselProps) => {
  const trilhoRef = useRef<HTMLDivElement>(null);
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
        className="carousel-track-mobile"
        role="region"
        aria-label="Carrossel de cards — deslize para navegar"
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

      <div role="tablist" aria-label="Indicadores de posição" className="carousel-indicators">
        {cards.map((_, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === indiceAtivo}
            aria-label={`Card ${i + 1} de ${cards.length}`}
            className={`carousel-indicator ${i === indiceAtivo ? 'carousel-indicator-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
