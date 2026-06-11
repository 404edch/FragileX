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
    const rawData = Object.fromEntries(formData.entries());
    
    // Mapeamento dos campos para a API
    const payload = {
        nome: rawData.nomePaciente,
        cpf: rawData.cpfPaciente,
        email: rawData.email,
        telefone: rawData.telefone,
        data_nascimento: rawData.dataNascimento,
        sexo_biologico: rawData.sexo_biologico === 'masculino' ? 'M' : 'F',
        genero: rawData.genero === 'masculino' ? 'Masculino' : 'Feminino',
        sindrome: 'normal', // Default or asked?
        senha: rawData.senha,
        id_medico: isMedico ? 1 : undefined // Mock ID medico for testing
    };

    try {
      // Mock da requisição que no futuro será feita via Supabase
      console.log('Payload para Supabase:', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(isMedico ? "Paciente registrado! Aguardando ativação." : "Conta criada com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      alert("Erro ao registrar.");
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
