import { useState, useEffect, useCallback } from 'react';
import { ALTURA_NAVBAR } from '../../../constants/constantes';
import { useLarguraJanela } from '../../../hooks/useHooks';
import Logo from '../../Shared/Logo';
import AnimatedContent from '../../Shared/AnimatedContent';
import BotaoHamburger from './BotaoHamburger';
import { motion } from 'motion/react';
import './Navbar.css';

interface Props {
  onLoginClick: () => void;
  usuarioLogado?: { email: string; nome?: string };
  onLogout: () => void;
}

const Navbar = ({ onLoginClick, usuarioLogado, onLogout }: Props) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalContatoAberto, setModalContatoAberto] = useState(false);
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 768;

  useEffect(() => {
    if (!ehMobile && menuAberto) setMenuAberto(false);
  }, [ehMobile, menuAberto]);

  const alternarMenu = useCallback(() => setMenuAberto((v) => !v), []);

  const textoBotaoLogin = usuarioLogado 
    ? (usuarioLogado.nome ? usuarioLogado.nome.toUpperCase() : 'DASHBOARD')
    : 'LOGIN';

  return (
    <header className="navbar-header">
      <nav className="navbar-nav" style={{ height: ALTURA_NAVBAR }} aria-label="Navegação principal">
        <a href="/" aria-label="Início — Eu Digo X" className="navbar-logo-link">
          <Logo pequeno={ehMobile} />
        </a>

        <div className="apenas-desktop navbar-actions-desktop">
          <AnimatedContent distance={20} direction="horizontal" duration={0.8} initialOpacity={0} animateOpacity>
            <button onClick={() => setModalContatoAberto(true)} className="navbar-link">
              CONTATO
            </button>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="horizontal" duration={0.8} initialOpacity={0} animateOpacity delay={0.1}>
            <button onClick={onLoginClick} className="navbar-login-btn">
              {textoBotaoLogin}
            </button>
          </AnimatedContent>
        </div>

        <div className="apenas-mobile">
          <BotaoHamburger aberto={menuAberto} onClick={alternarMenu} />
        </div>
      </nav>

      {ehMobile && menuAberto && (
        <div id="mobile-nav" role="navigation" aria-label="Menu mobile" className="mobile-menu navbar-mobile-nav">
          <AnimatedContent distance={30} direction="vertical" duration={0.8} initialOpacity={0} animateOpacity>
            <button 
              onClick={() => {
                setModalContatoAberto(true);
                setMenuAberto(false);
              }}
              className="navbar-link navbar-link-center"
            >
              CONTATO
            </button>
          </AnimatedContent>

          <div className="navbar-mobile-divider" />

          <AnimatedContent distance={30} direction="vertical" duration={0.8} initialOpacity={0} animateOpacity delay={0.1}>
            <button onClick={onLoginClick} className="navbar-login-btn navbar-login-mobile">
              {textoBotaoLogin}
            </button>
          </AnimatedContent>
        </div>
      )}

      {/* Modal de Contato */}
      {modalContatoAberto && (
        <div className="modal-backdrop">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="modal-content"
          >
            <button onClick={() => setModalContatoAberto(false)} className="modal-close-btn" aria-label="Fechar">
              &times;
            </button>
            <h2 className="modal-title">Instituto Buko Kaesemodel</h2>
            <div className="modal-info-list">
              <p>
                <strong>Endereço:</strong><br/>
                <a href="https://maps.google.com/?q=Rua+Exemplo,+123+-+Curitiba,+PR" target="_blank" rel="noreferrer" style={{ color: '#1a5fa8', textDecoration: 'none' }}>
                  Rua Exemplo, 123 - Curitiba, PR
                </a>
              </p>
              <p>
                <strong>Telefone:</strong><br/>
                <a href="tel:+5541999999999" style={{ color: '#1a5fa8', textDecoration: 'none' }}>
                  (41) 99999-9999
                </a>
              </p>
              <p>
                <strong>E-mail:</strong><br/>
                <a href="mailto:contato@institutobuko.org.br" style={{ color: '#1a5fa8', textDecoration: 'none' }}>
                  contato@institutobuko.org.br
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
