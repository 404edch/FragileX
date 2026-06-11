import DadosPessoais from "./DadosPessoais";
import BotaoInicio from "../Shared/BotaoInicio";
import { useAuth } from "../../contexts/AuthContext";
import { sendCadastro } from "../../services/sendCadastro";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";

export default function RegistroPaciente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const isMedico = usuario?.role === 'medico';

  const formAction = async (formData: FormData) => {
    const dadosPessoais = Object.fromEntries(formData.entries());

    try {
      await sendCadastro(dadosPessoais);
      alert("Paciente registrado com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      alert("Erro ao registrar paciente. Tente novamente.");
    }
  };

  return (
    <div className="checklist-wrapper">
      <form action={formAction} className="cadastro-form">
        <DadosPessoais isMedico={isMedico} />

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio />
          <button type="submit" className="checklist-submit-btn">
            Finalizar Cadastro do Paciente
          </button>
        </div>
      </form>
    </div>
  );
}
