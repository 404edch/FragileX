import React, { useState, useEffect } from 'react';

interface InContextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; imagemUrl: string; linkHref: string }) => void;
  onDelete?: () => void;
  initialData: { nome: string; imagemUrl?: string; linkHref?: string };
  title: string;
}

export default function InContextEditModal({ isOpen, onClose, onSave, onDelete, initialData, title }: InContextEditModalProps) {
  const [nome, setNome] = useState('');
  const [linkHref, setLinkHref] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNome(initialData.nome || '');
      setLinkHref(initialData.linkHref || '');
      setImagemUrl(initialData.imagemUrl || '');
      setImagePreview(initialData.imagemUrl || '');
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB to prevent localStorage overflow)
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagemUrl(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Por favor, informe um título/nome.');
      return;
    }
    onSave({
      nome,
      linkHref,
      imagemUrl
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        animation: 'modalFadeIn 0.3s ease-out'
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        
        <div style={{
          background: '#f8fafc',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#94a3b8',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <div className="cadastro-item" style={{ width: '100%' }}>
            <label className="cadastro-label">Título / Legenda</label>
            <input
              type="text"
              className="cadastro-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Equipe BK, Projetos, Notícias..."
              required
            />
          </div>

          <div className="cadastro-item" style={{ width: '100%' }}>
            <label className="cadastro-label">Link de Destino (HREF)</label>
            <input
              type="url"
              className="cadastro-input"
              value={linkHref}
              onChange={(e) => setLinkHref(e.target.value)}
              placeholder="https://exemplo.com/pagina"
            />
          </div>

          <div className="cadastro-item" style={{ width: '100%' }}>
            <label className="cadastro-label">Upload de Imagem (JPEG/PNG, máx 2MB)</label>
            <input
              type="file"
              accept="image/*"
              className="cadastro-input"
              onChange={handleFileChange}
              style={{ padding: '6px 12px' }}
            />
          </div>

          {imagePreview && (
            <div style={{ marginTop: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Pré-visualização da Imagem:</span>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '140px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '12px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onClose}
              style={{ padding: '10px 18px', fontSize: '13px', margin: 0 }}
            >
              Cancelar
            </button>
            {onDelete && initialData?.nome !== '' && (
              <button
                type="button"
                className="hero-btn-secondary"
                onClick={onDelete}
                style={{ padding: '10px 18px', fontSize: '13px', margin: 0, backgroundColor: '#fef2f2', color: '#ef4444', borderColor: '#fca5a5' }}
              >
                Excluir
              </button>
            )}
            <button
              type="submit"
              className="checklist-submit-btn"
              style={{ padding: '10px 18px', fontSize: '13px', width: 'auto', margin: 0 }}
            >
              Confirmar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
