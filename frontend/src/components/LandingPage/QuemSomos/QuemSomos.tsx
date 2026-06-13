import React, { useRef, useState, useEffect } from 'react';
import { useLarguraJanela, useUmaVezNoViewport } from '../../../hooks/useHooks';
import { CarrosselDesktop, CarrosselMobile } from '../Carrossel/Carrossel';
import AnimatedContent from '../../Shared/AnimatedContent';
import './QuemSomos.css';
import { landingService } from '../../../services/landingService';
import { useAuth } from '../../../contexts/AuthContext';
import InContextEditModal from '../InContextEditModal';
import { LandingCard } from '../../../services/types';

const QuemSomos = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 768;
  
  const { usuario } = useAuth();
  const isAdmin = usuario?.role === 'admin';

  const [cards, setCards] = useState<LandingCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<LandingCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarCards = async () => {
    try {
      const data = await landingService.getLandingCards();
      setCards(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      carregarCards();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const secaoRef = useRef(null);
  const cabecalhoVisto = useUmaVezNoViewport(secaoRef, 0.2);

  const handleEditCard = (id: number) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      setSelectedCard(card);
      setIsModalOpen(true);
    }
  };

  const handleAddNewCardClick = () => {
    setSelectedCard({ id: -1, nome: '', imagemUrl: '', linkHref: '', etiquetaImg: 'Foto' });
    setIsModalOpen(true);
  };

  const handleSaveCard = async (data: { nome: string; imagemUrl: string; linkHref: string }) => {
    if (!selectedCard) return;
    
    let updated;
    if (selectedCard.id === -1) {
      const nextId = cards.length > 0 ? Math.max(...cards.map(c => Number(c.id))) + 1 : 1;
      updated = [
        ...cards,
        {
          id: nextId,
          nome: data.nome,
          linkHref: data.linkHref,
          imagemUrl: data.imagemUrl,
          etiquetaImg: data.imagemUrl ? 'Imagem Carregada' : 'Foto'
        }
      ];
    } else {
      updated = cards.map(c => {
        if (c.id === selectedCard.id) {
          return {
            ...c,
            nome: data.nome,
            linkHref: data.linkHref,
            imagemUrl: data.imagemUrl || c.imagemUrl,
            etiquetaImg: data.imagemUrl ? 'Imagem Carregada' : c.etiquetaImg
          };
        }
        return c;
      });
    }
    
    try {
      await landingService.saveLandingCards(updated);
      setCards(updated);
      setIsModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard || selectedCard.id === -1) return;
    const updated = cards.filter(c => c.id !== selectedCard.id);
    try {
      await landingService.saveLandingCards(updated);
      setCards(updated);
      setIsModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section
      ref={secaoRef}
      aria-labelledby="quem-somos-titulo"
      className="quem-somos-section"
    >
      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15}>
        <header
          className={`quem-somos-header ${cabecalhoVisto ? "anim-subir" : ""}`}
          style={{ opacity: cabecalhoVisto ? undefined : 0 }}
        >
          <h2 id="quem-somos-titulo" className="quem-somos-title">
            QUEM SOMOS NÓS
          </h2>
          <p className="quem-somos-subtitle">
            Conheça a equipe, nossa missão e o impacto que geramos juntos.
          </p>
          {isAdmin && (
            <button
              type="button"
              onClick={handleAddNewCardClick}
              className="checklist-submit-btn"
              style={{
                width: 'auto',
                margin: '16px auto 0',
                padding: '8px 20px',
                fontSize: '13px',
                backgroundColor: '#22c55e',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Adicionar Novo Card
            </button>
          )}
        </header>
      </AnimatedContent>

      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15} delay={0.2}>
        <div className="quem-somos-carousel-wrapper">
          {ehMobile
            ? <CarrosselMobile cards={cards} onEdit={handleEditCard} />
            : <CarrosselDesktop cards={cards} onEdit={handleEditCard} />
          }
        </div>
      </AnimatedContent>

      {selectedCard && (
        <InContextEditModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCard(null); }}
          onSave={handleSaveCard}
          onDelete={selectedCard.id !== -1 ? handleDeleteCard : undefined}
          initialData={{
            nome: selectedCard.nome,
            imagemUrl: selectedCard.imagemUrl,
            linkHref: selectedCard.linkHref
          }}
          title={selectedCard.id === -1 ? 'Novo Card' : `Editar Card: ${selectedCard.nome}`}
        />
      )}
    </section>
  );
};

export default QuemSomos;
