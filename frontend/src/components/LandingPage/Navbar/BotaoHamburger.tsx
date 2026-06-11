interface Props {
  aberto: boolean;
  onClick: () => void;
}

const BotaoHamburger = ({ aberto, onClick }: Props) => (
  <button
    onClick={onClick}
    aria-label={aberto ? "Fechar menu" : "Abrir menu"}
    aria-expanded={aberto}
    aria-controls="mobile-nav"
    className={`hamburger-btn ${aberto ? "hamburger-aberto" : ""}`}
  >
    <span className="hamburger-line line-top" />
    <span className="hamburger-line line-mid" />
    <span className="hamburger-line line-bot" />
  </button>
);

export default BotaoHamburger;
