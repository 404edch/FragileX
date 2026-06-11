import { useNavigate } from "react-router-dom";

interface Props {
  label?: string;
  to?: string;
}

const BotaoInicio = ({ label = "Início", to = "/" }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="hero-btn-secondary"
      onClick={() => navigate(to)}
      style={{ background: "transparent", color: "white", border: "1px solid white" }}
    >
      {label}
    </button>
  );
};

export default BotaoInicio;
