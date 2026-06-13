import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LARGURA_CARD, ESPACAMENTO_CARD } from '../../../constants/constantes';
import { useLarguraJanela } from '../../../hooks/useHooks';
import { useAuth } from '../../../contexts/AuthContext';
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
  id: number | string;
  nome: string;
  etiquetaImg: string;
  imagemUrl?: string;
  linkHref?: string;
  estilo?: React.CSSProperties;
  onEdit?: (id: number | string) => void;
}

export const CardCarrossel = ({ id, nome, etiquetaImg, imagemUrl, linkHref, estilo: estiloExtra, onEdit }: CardCarrosselProps) => {
  const { usuario } = useAuth();
  const isAdmin = usuario?.role === 'admin';

  const cardContent = (
    <article
      className="carousel-card"
      style={{
        width: LARGURA_CARD,
        cursor: linkHref ? 'pointer' : 'default',
        position: 'relative',
        ...estiloExtra,
      }}
    >
      {isAdmin && onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit(id);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#1a5fa8',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          title="Editar Card"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#144d8a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#1a5fa8';
          }}
        >
          +
        </button>
      )}
      <div className="carousel-card-title">
        {nome}
      </div>
      {imagemUrl ? (
        <img
          src={imagemUrl}
          alt={nome}
          style={{ objectFit: 'cover', display: 'block', width: '100%', height: '180px' }}
        />
      ) : (
        <ImagemPlaceholder etiqueta={etiquetaImg} />
      )}
    </article>
  );

  if (linkHref) {
    return (
      <a href={linkHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

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
  cards: { id: number | string; nome: string; etiquetaImg: string; imagemUrl?: string; linkHref?: string }[];
  onEdit?: (id: number | string) => void;
}
export const CarrosselDesktop = ({ cards, onEdit }: CarrosselProps) => {
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
    const timeoutId = window.setTimeout(() => {
      setOffset((prev) => Math.min(prev, offsetMaximo));
    }, 0);

    return () => window.clearTimeout(timeoutId);
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
              id={card.id}
              nome={card.nome}
              etiquetaImg={card.etiquetaImg}
              imagemUrl={card.imagemUrl}
              linkHref={card.linkHref}
              estilo={{}}
              onEdit={onEdit}
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

export const CarrosselMobile = ({ cards, onEdit }: CarrosselProps) => {
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
            id={card.id}
            nome={card.nome}
            etiquetaImg={card.etiquetaImg}
            imagemUrl={card.imagemUrl}
            linkHref={card.linkHref}
            estilo={{ width: "calc(100vw - 60px)", maxWidth: 320 }}
            onEdit={onEdit}
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
