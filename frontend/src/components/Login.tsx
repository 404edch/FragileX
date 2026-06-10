import React, { useState, useCallback } from 'react';
import AnimatedContent from './AnimatedContent';

/**
 * Componente de Login com validação de formulário
 * Oferece autenticação com email e senha
 * Responsivo para mobile e desktop
 */
interface LoginProps {
  onClose?: () => void;
  onLoginSuccess?: (data: { email: string; senha?: string }) => void;
}
const Login = ({ onClose, onLoginSuccess }: LoginProps) => {
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [emailTocado, setEmailTocado] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);

  // Validação de email
  const validarEmail = (e: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(e);
  };

  // Validação de senha
  const validarSenha = (s: string) => s.length >= 6;

  // Erros de validação
  const erroEmail = emailTocado && email && !validarEmail(email);
  const erroSenha = senhaTocada && senha && !validarSenha(senha);
  const formValido = email && senha && validarEmail(email) && validarSenha(senha);

  // Manipulador de submissão do formulário
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Simular requisição de autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validação final
      if (!validarEmail(email)) {
        setErro('Email inválido');
        setCarregando(false);
        return;
      }

      if (!validarSenha(senha)) {
        setErro('Senha deve ter no mínimo 6 caracteres');
        setCarregando(false);
        return;
      }

      // Sucesso
      if (onLoginSuccess) onLoginSuccess({ email, senha });
      
      // Limpar formulário e fechar modal
      setEmail('');
      setSenha('');
      setCarregando(false);
      if (onClose) onClose();
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login. Tente novamente.');
      setCarregando(false);
    }
  }, [email, senha, onLoginSuccess, onClose]);

  // Estilos reutilizáveis
  const estiloInput = {
    base: {
      width: '100%',
      padding: '11px 14px',
      fontSize: 14,
      border: '1px solid #ddd',
      borderRadius: 6,
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
    focado: {
      borderColor: '#1a5fa8',
      boxShadow: '0 0 0 3px rgba(26, 95, 168, 0.1)',
      outline: 'none',
    },
    erro: {
      borderColor: '#dc2626',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <AnimatedContent
        distance={30}
        direction="vertical"
        duration={0.6}
        initialOpacity={0}
        animateOpacity
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 'clamp(24px, 6vw, 40px)',
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Cabeçalho */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h2
              id="login-title"
              style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 700,
                color: '#111',
                margin: '0 0 8px 0',
              }}
            >
              Bem-vindo
            </h2>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
              Faça login para continuar
            </p>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <AnimatedContent distance={10} direction="vertical" duration={0.3} initialOpacity={0} animateOpacity>
              <div
                role="alert"
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  padding: '10px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {erro}
              </div>
            </AnimatedContent>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Campo Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="email-input"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTocado(true)}
                style={{
                  ...estiloInput.base,
                  ...(emailTocado && email && validarEmail(email) ? estiloInput.focado : {}),
                  ...(erroEmail ? estiloInput.erro : {}),
                }}
                aria-invalid={!!erroEmail}
                aria-describedby={erroEmail ? 'email-error' : undefined}
              />
              {erroEmail && (
                <span id="email-error" style={{ fontSize: 12, color: '#dc2626' }}>
                  Email inválido
                </span>
              )}
            </div>

            {/* Campo Senha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
                htmlFor="senha-input"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Senha
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="senha-input"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={() => setSenhaTocada(true)}
                  style={{
                    ...estiloInput.base,
                    paddingRight: 44,
                    ...(senhaTocada && senha && validarSenha(senha) ? estiloInput.focado : {}),
                    ...(erroSenha ? estiloInput.erro : {}),
                  }}
                  aria-invalid={!!erroSenha}
                  aria-describedby={erroSenha ? 'senha-error' : undefined}
                />
                {senha && (
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    style={{
                      position: 'absolute',
                      right: 12,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 18,
                      padding: 4,
                      color: '#666',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1a5fa8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                  >
                    {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                  </button>
                )}
              </div>
              {erroSenha && (
                <span id="senha-error" style={{ fontSize: 12, color: '#dc2626' }}>
                  Mínimo 6 caracteres
                </span>
              )}
            </div>

            {/* Botão Enviar */}
            <button
              type="submit"
              disabled={!formValido || carregando}
              style={{
                background: formValido && !carregando ? '#1a5fa8' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '11px 16px',
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                cursor: formValido && !carregando ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                marginTop: 8,
              }}
              onMouseEnter={(e) => {
                if (formValido && !carregando) {
                  e.currentTarget.style.background = '#0d3a6b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 95, 168, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1a5fa8';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Rodapé */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#666' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => setEmail('novo@usuario.com')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1a5fa8',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Cadastre-se
              </button>
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#1a5fa8',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Login;
