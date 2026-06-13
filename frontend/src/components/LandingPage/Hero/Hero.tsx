import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALTURA_NAVBAR } from '../../../constants/constantes';
import { useLarguraJanela } from '../../../hooks/useHooks';
import AnimatedContent from '../../Shared/AnimatedContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';
import { landingService } from '../../../services/landingService';
import { useAuth } from '../../../contexts/AuthContext';
import InContextEditModal from '../InContextEditModal';
import { MockNews } from '../../../services/types';

gsap.registerPlugin(ScrollTrigger);

const ehDispositivoTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

const Hero = () => {
  const navigate = useNavigate();
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 480;
  const mascotRef = useRef(null);
  const sectionRef = useRef(null);

  const { usuario } = useAuth();
  const isAdmin = usuario?.role === 'admin';

  const [news, setNews] = useState<MockNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<MockNews | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarNews = async () => {
    try {
      const data = await landingService.getLandingNews();
      setNews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      carregarNews();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (ehDispositivoTouch()) return;

    if (mascotRef.current && sectionRef.current) {
      gsap.to(mascotRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom center",
          scrub: 0.5,
          markers: false,
        },
      });
    }
  }, []);

  const handleEditNews = (n: MockNews) => {
    setSelectedNews(n);
    setIsModalOpen(true);
  };

  const handleSaveNews = async (data: { nome: string; imagemUrl: string; linkHref: string }) => {
    if (!selectedNews) return;

    let updated;
    if (selectedNews.id === -1) {
      const nextId = news.length > 0 ? Math.max(...news.map(n => Number(n.id))) + 1 : 1;
      updated = [
        ...news,
        {
          id: nextId,
          titulo: data.nome,
          linkHref: data.linkHref,
          imagemUrl: data.imagemUrl
        }
      ];
    } else {
      updated = news.map(n => {
        if (n.id === selectedNews.id) {
          return {
            ...n,
            titulo: data.nome,
            linkHref: data.linkHref,
            imagemUrl: data.imagemUrl || n.imagemUrl
          };
        }
        return n;
      });
    }

    try {
      await landingService.saveLandingNews(updated);
      setNews(updated);
      setIsModalOpen(false);
      setSelectedNews(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNews = async () => {
    if (!selectedNews || selectedNews.id === -1) return;
    const updated = news.filter(n => n.id !== selectedNews.id);
    try {
      await landingService.saveLandingNews(updated);
      setNews(updated);
      setIsModalOpen(false);
      setSelectedNews(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-label="Bem-vindo ao Instituto Buko Kaesemodel"
      style={{ marginTop: ALTURA_NAVBAR }}
    >
      <div className="hero-content" style={{ maxWidth: ehMobile ? 320 : 540 }}>
        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.08}>
          <button className="hero-btn-primary" onClick={() => navigate('/registro')}>
            Cadastre-se
          </button>
        </AnimatedContent>

        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.22}>
          <button className="hero-btn-secondary" onClick={() => navigate('/aplicacao-medico')}>
            Sou um Médico
          </button>
        </AnimatedContent>

        {news.length === 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div aria-label="Seção de notícias" className="hero-news-placeholder" />
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setSelectedNews({ id: -1, titulo: '', imagemUrl: '', linkHref: '' });
                  setIsModalOpen(true);
                }}
                className="checklist-submit-btn"
                style={{
                  width: 'auto',
                  marginTop: '12px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                + Adicionar Notícia
              </button>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setSelectedNews({ id: -1, titulo: '', imagemUrl: '', linkHref: '' });
                  setIsModalOpen(true);
                }}
                className="checklist-submit-btn"
                style={{
                  width: 'auto',
                  margin: '0 auto 8px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Adicionar Notícia
              </button>
            )}
            {news.map(n => (
              <div key={n.id} style={{ position: 'relative', width: '100%' }}>
                <a
                  href={n.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '16px',
                    color: '#fff',
                    textDecoration: 'none',
                    gap: '16px',
                    width: '100%',
                    transition: 'transform 0.2s, background 0.2s',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                  {n.imagemUrl && (
                    <img
                      src={n.imagemUrl}
                      alt={n.titulo}
                      style={{
                        width: '120px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>
                      Destaque Informativo
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '2px 0 0', color: '#ffffff' }}>
                      {n.titulo}
                    </h4>
                  </div>
                  <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)' }}>→</span>
                </a>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEditNews(n);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#1a5fa8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s, background-color 0.2s',
                    }}
                    title="Editar Notícia"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mascote Buko - Responsivo */}
      <AnimatedContent distance={60} direction="horizontal" duration={0.9} initialOpacity={1} animateOpacity={false} scale={1.02} delay={0.3}>
        <div
          ref={mascotRef}
          className="hero-mascot-container"
          style={{
            right: ehMobile ? "-20px" : "-340px",
            bottom: ehMobile ? "-300px" : "-210px",
            transform: ehMobile ? "translateX(20%) rotate(-8deg)" : "rotate(-8deg)",
            width: ehMobile ? 200 : 320,
            height: ehMobile ? 240 : 380,
            opacity: ehMobile ? 1 : 1,
            zIndex: 0,
          }}
        >
          <img src="/buko.png" alt="Mascote Buko acenando" className="hero-mascot-img" />
        </div>
      </AnimatedContent>

      {selectedNews && (
        <InContextEditModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedNews(null); }}
          onSave={handleSaveNews}
          onDelete={selectedNews.id !== -1 ? handleDeleteNews : undefined}
          initialData={{
            nome: selectedNews.titulo,
            imagemUrl: selectedNews.imagemUrl,
            linkHref: selectedNews.linkHref
          }}
          title={selectedNews.id === -1 ? 'Nova Notícia' : `Editar Notícia: ${selectedNews.titulo}`}
        />
      )}
    </section>
  );
};

export default Hero;
