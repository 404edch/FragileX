import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getSintomas } from "../../services/getSintomas";
import ChecklistItems from "./ChecklistItems";
import ItemCadastro from "./ItemCadastro";
import BotaoInicio from "../Shared/BotaoInicio";
import "./Checklist.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { mockDbService } from "../../services/mockDbService";

const promiseSintomas = getSintomas();

interface Props {
  isRapido?: boolean;
}

export default function PreencherChecklist({ isRapido = false }: Props) {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<number[]>([]);
  const navigate = useNavigate();
  const { usuario, atualizarUsuarioLogado } = useAuth();

  useEffect(() => {
    if (usuario && usuario.role === 'paciente' && !isRapido) {
      alert("Acesso negado: pacientes não têm permissão para preencher ou editar seu próprio checklist.");
      navigate('/dashboard');
    }
  }, [usuario, navigate, isRapido]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    if (isRapido) {
      const sintomasList = await promiseSintomas;
      const scoreEstimado = sintomasSelecionados.reduce((sum, id) => {
        const s = sintomasList.find(item => item.id === id);
        return sum + (s ? Number(s.peso_M) : 2.5);
      }, 0);
      alert(`Checklist Rápido finalizado!\nSintomas selecionados: ${sintomasSelecionados.length}\n(Score estimado: ${scoreEstimado.toFixed(1)} pts)`);
      navigate('/dashboard');
      return;
    }

    // Fluxo formal vinculado a um paciente
    let idPaciente = 0;
    let preenchidoPor = 'Médico';
    let idMedico: number | null = null;
    let isMale = true;

    if (usuario && usuario.role === 'paciente') {
      idPaciente = usuario.id;
      preenchidoPor = 'Paciente (Autopreenchimento)';
      const details = await mockDbService.getPaciente(usuario.id);
      isMale = details ? details.sexo_biologico === 'M' : true;
    } else {
      // É médico ou instituto preenchendo para um paciente por CPF
      const cpf = dados.cpfPaciente as string;
      const allPacientes = await mockDbService.listarTodosPacientes();
      const userPaciente = allPacientes.find(p => p.cpf === cpf);
      
      if (!userPaciente) {
        alert("Paciente não encontrado com o CPF informado. Certifique-se de cadastrar o paciente antes de preencher o checklist.");
        return;
      }

      idPaciente = userPaciente.id;
      preenchidoPor = usuario ? usuario.nome : 'Médico';
      idMedico = usuario ? usuario.id : null;
      isMale = userPaciente.pacienteDetails ? userPaciente.pacienteDetails.sexo_biologico === 'M' : true;
    }

    try {
      const sintomasList = await promiseSintomas;
      const scoreFinal = sintomasSelecionados.reduce((sum, id) => {
        const s = sintomasList.find(item => item.id === id);
        if (s) {
          return sum + (isMale ? Number(s.peso_M) : Number(s.peso_F));
        }
        return sum + 2.5;
      }, 0);

      await mockDbService.salvarChecklistPaciente(idPaciente, idMedico, preenchidoPor, sintomasSelecionados, scoreFinal);
      alert(`Checklist salvo com sucesso para o paciente!\nScore Clínico: ${scoreFinal.toFixed(1)} pts.`);
      
      if (usuario && usuario.role === 'paciente') {
        await atualizarUsuarioLogado();
      }

      navigate('/dashboard');
    } catch (error) {
      alert("Erro ao salvar o checklist. Tente novamente.");
    }
  };

  return (
    <div className="checklist-wrapper">
      <form className="cadastro-form" onSubmit={handleSubmit}>

        {!isRapido && (!usuario || usuario.role !== 'paciente') && (
          <div className="checklist-container" style={{ marginBottom: "24px" }}>
            <h2 className="checklist-title" style={{ fontSize: '1.5rem' }}>Identificação do Paciente</h2>
            <p className="checklist-subtitle">Informe os dados básicos do paciente para vincular este checklist.</p>
            <div className="cadastro-grid">
              <ItemCadastro label="Nome do Paciente" name="nomePaciente" required />
              <ItemCadastro label="E-mail" name="emailPaciente" type="email" required />
              <ItemCadastro label="CPF do Paciente" name="cpfPaciente" required />
            </div>
          </div>
        )}

        {/* Se for paciente preenchendo o próprio checklist */}
        {!isRapido && usuario && usuario.role === 'paciente' && (
          <div className="checklist-container" style={{ marginBottom: "24px" }}>
            <h2 className="checklist-title" style={{ fontSize: '1.5rem' }}>Identificação do Paciente</h2>
            <p className="checklist-subtitle">Preenchendo para: <strong>{usuario.nome}</strong> (CPF: {usuario.cpf})</p>
          </div>
        )}

        <ErrorBoundary
          fallback={
            <div className="checklist-container checklist-error-container">
              <h2 className="checklist-error-title">Ops! Algo deu errado.</h2>
              <button className="checklist-retry-btn" onClick={() => window.location.reload()}>
                Tentar Novamente
              </button>
            </div>
          }
        >
          <Suspense fallback={<div className="checklist-container"><h2 className="checklist-loading">Carregando checklist...</h2></div>}>
            <div className="checklist-container">
              <h1 className="checklist-title">
                {isRapido ? "Checklist Rápido (Sem Vínculo)" : "Checklist de Sintomas"}
              </h1>
              <p className="checklist-subtitle">
                {isRapido
                  ? "Avalie os sintomas rapidamente. Estes dados não serão salvos no banco de dados."
                  : "Selecione os sintomas observados no paciente."}
              </p>
              <ChecklistItems
                promiseSintomas={promiseSintomas}
                onChange={setSintomasSelecionados}
              />
            </div>
          </Suspense>
        </ErrorBoundary>

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio label="Cancelar" />
          <button type="submit" className="checklist-submit-btn">
            {isRapido ? "Calcular Score" : "Salvar Checklist"}
          </button>
        </div>
      </form>
    </div>
  );
}

