import React, { useState, useEffect } from 'react';
import { backendService, type LandingCard, type MockNews } from '../../services/backendService';
import './Dashboard.css';

const EditLanding = () => {
  const [cards, setCards] = useState<LandingCard[]>([]);
  const [news, setNews] = useState<MockNews[]>([]);
  const [activeTab, setActiveTab] = useState<'cards' | 'news'>('cards');

  // Estados para nova notícia
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsLink, setNewNewsLink] = useState('');
  const [newNewsImage, setNewNewsImage] = useState('');

  const carregarDados = async () => {
    try {
      const cardsData = await backendService.getLandingCards();
      const newsData = await backendService.getLandingNews();
      setCards(cardsData);
      setNews(newsData);
    } catch (error) {
      console.error("Erro ao carregar dados da landing page:", error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCardChange = (id: number, field: keyof LandingCard, value: string) => {
    const updated = cards.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    setCards(updated);
  };

  const handleCardImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updated = cards.map(c => {
          if (c.id === id) {
            return { ...c, imagemUrl: base64 };
          }
          return c;
        });
        setCards(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarCards = async () => {
    try {
      await backendService.saveLandingCards(cards);
      alert('Cards do carrossel Quem Somos salvos com sucesso!');
      await carregarDados();
    } catch (error) {
      console.error(error);
    }
  };

  const resetarCardsPadrao = () => {
    alert('Operação indisponível. Edite os cards diretamente através da tabela e salve.');
  };

  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, id?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isNew) {
          setNewNewsImage(base64);
        } else if (id !== undefined) {
          const updated = news.map(n => {
            if (n.id === id) {
              return { ...n, imagemUrl: base64 };
            }
            return n;
          });
          setNews(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewsChange = (id: number, field: keyof MockNews, value: string) => {
    const updated = news.map(n => {
      if (n.id === id) {
        return { ...n, [field]: value };
      }
      return n;
    });
    setNews(updated);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsLink) {
      alert('Preencha pelo menos o título e o link da notícia.');
      return;
    }

    const newItem: MockNews = {
      id: Date.now(),
      titulo: newNewsTitle,
      linkHref: newNewsLink,
      imagemUrl: newNewsImage
    };

    const updated = [...news, newItem];
    try {
      await backendService.saveLandingNews(updated);
      setNews(updated);
      setNewNewsTitle('');
      setNewNewsLink('');
      setNewNewsImage('');
      alert('Nova notícia/banner adicionada com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveNews = async (id: number) => {
    const updated = news.filter(n => n.id !== id);
    try {
      await backendService.saveLandingNews(updated);
      setNews(updated);
      alert('Notícia removida.');
    } catch (error) {
      console.error(error);
    }
  };

  const salvarNoticiasModificadas = async () => {
    try {
      await backendService.saveLandingNews(news);
      alert('Alterações nas notícias salvas com sucesso!');
      await carregarDados();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Título Principal */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a5fa8', marginBottom: '8px' }}>
          Personalização da Landing Page
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
          Altere os cards do carrossel principal e adicione/edite a seção de notícias abaixo dos botões da Home.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className="checklist-submit-btn"
          style={{
            margin: 0,
            padding: '8px 16px',
            fontSize: '13px',
            background: activeTab === 'cards' ? '#1a5fa8' : 'rgba(255,255,255,0.2)',
            border: activeTab === 'cards' ? 'none' : '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Cards do Carrossel (Quem Somos)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className="checklist-submit-btn"
          style={{
            margin: 0,
            padding: '8px 16px',
            fontSize: '13px',
            background: activeTab === 'news' ? '#1a5fa8' : 'rgba(255,255,255,0.2)',
            border: activeTab === 'news' ? 'none' : '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Seção de Notícias / Destaques
        </button>
      </div>

      {/* View: Cards */}
      {activeTab === 'cards' && (
        <div className="dashboard-med-registration" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', color: '#1a3a6e', margin: 0, fontWeight: 'bold' }}>
              Cards de Quem Somos ({cards.length})
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={salvarCards}
                className="checklist-submit-btn"
                style={{ margin: 0, padding: '8px 16px', fontSize: '13px', background: '#22c55e', border: 'none' }}
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={resetarCardsPadrao}
                className="checklist-submit-btn"
                style={{ margin: 0, padding: '8px 16px', fontSize: '13px', background: '#ef4444', border: 'none' }}
              >
                Resetar Padrões
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '8px'
          }}>
            {cards.map(card => (
              <div
                key={card.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {card.imagemUrl ? (
                    <img
                      src={card.imagemUrl}
                      alt={card.nome}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      background: '#cbd5e1',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      Placeholder
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>ID: {card.id}</span>
                    <input
                      type="text"
                      className="cadastro-input"
                      style={{ margin: '4px 0 0', padding: '6px 10px', fontSize: '14px', fontWeight: 'bold' }}
                      value={card.nome}
                      onChange={(e) => handleCardChange(card.id, 'nome', e.target.value)}
                    />
                  </div>
                </div>

                <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                  <label className="cadastro-label" style={{ fontSize: '11px' }}>Link de Redirecionamento (HREF)</label>
                  <input
                    type="url"
                    className="cadastro-input"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    placeholder="https://exemplo.com"
                    value={card.linkHref || ''}
                    onChange={(e) => handleCardChange(card.id, 'linkHref', e.target.value)}
                  />
                </div>

                <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                  <label className="cadastro-label" style={{ fontSize: '11px' }}>Carregar Nova Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ fontSize: '12px' }}
                    onChange={(e) => handleCardImageUpload(card.id, e)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: News */}
      {activeTab === 'news' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Adicionar nova notícia */}
          <div className="dashboard-med-registration">
            <h3 style={{ fontSize: '18px', color: '#1a3a6e', marginBottom: '14px', fontWeight: 'bold' }}>
              Adicionar Novo Destaque / Banner Informativo
            </h3>
            
            <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                  <label className="cadastro-label">Título do Banner</label>
                  <input
                    type="text"
                    className="cadastro-input"
                    placeholder="Ex: Saiba tudo sobre diagnóstico precoce!"
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                  <label className="cadastro-label">Link HREF</label>
                  <input
                    type="url"
                    className="cadastro-input"
                    placeholder="https://xfragil.org.br/diagnostico/"
                    value={newNewsLink}
                    onChange={(e) => setNewNewsLink(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="cadastro-item" style={{ margin: 0, flex: 1 }}>
                  <label className="cadastro-label">Imagem de Fundo (Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleNewsImageUpload(e, true)}
                  />
                </div>
                {newNewsImage && (
                  <img
                    src={newNewsImage}
                    alt="Preview"
                    style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ddd' }}
                  />
                )}
              </div>

              <button
                type="submit"
                className="checklist-submit-btn"
                style={{ width: 'fit-content', padding: '8px 24px', fontSize: '13px', margin: '4px 0 0' }}
              >
                Adicionar e Salvar
              </button>
            </form>
          </div>

          {/* Lista de notícias cadastradas */}
          <div className="dashboard-med-registration">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '18px', color: '#1a3a6e', margin: 0, fontWeight: 'bold' }}>
                Destaques Ativos ({news.length})
              </h3>
              {news.length > 0 && (
                <button
                  type="button"
                  onClick={salvarNoticiasModificadas}
                  className="checklist-submit-btn"
                  style={{ margin: 0, padding: '8px 16px', fontSize: '13px', background: '#22c55e', border: 'none' }}
                >
                  Salvar Modificações
                </button>
              )}
            </div>

            {news.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Nenhum destaque ativo. O placeholder tracejado será exibido na home.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {news.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {n.imagemUrl ? (
                        <img
                          src={n.imagemUrl}
                          alt="Notícia"
                          style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }}
                        />
                      ) : (
                        <div style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          background: '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: '#475569'
                        }}>
                          Sem Imagem
                        </div>
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                          <label className="cadastro-label" style={{ fontSize: '11px' }}>Título</label>
                          <input
                            type="text"
                            className="cadastro-input"
                            style={{ padding: '6px 10px', fontSize: '13px' }}
                            value={n.titulo}
                            onChange={(e) => handleNewsChange(n.id, 'titulo', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                        <label className="cadastro-label" style={{ fontSize: '11px' }}>Link HREF</label>
                        <input
                          type="url"
                          className="cadastro-input"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          value={n.linkHref}
                          onChange={(e) => handleNewsChange(n.id, 'linkHref', e.target.value)}
                        />
                      </div>
                      <div className="cadastro-item" style={{ width: '100%', margin: 0 }}>
                        <label className="cadastro-label" style={{ fontSize: '11px' }}>Alterar Imagem</label>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ fontSize: '12px' }}
                          onChange={(e) => handleNewsImageUpload(e, false, n.id)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <button
                        type="button"
                        className="checklist-submit-btn"
                        style={{ margin: 0, padding: '6px 12px', fontSize: '12px', background: '#ef4444', border: 'none' }}
                        onClick={() => handleRemoveNews(n.id)}
                      >
                        Excluir Destaque
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default EditLanding;
