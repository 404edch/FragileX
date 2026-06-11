import type { FormEvent } from 'react';
import ItemCadastro from '../../Checklist/ItemCadastro';
import BotaoInicio from '../../Shared/BotaoInicio';
import '../../Checklist/Checklist.css';
import { useNavigate } from 'react-router-dom';

const AplicacaoMedico = () => {
  const navigate = useNavigate();

  const handleApply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Sua aplicação foi enviada para análise do Instituto Buko Kaesemodel. Entraremos em contato em breve!");
    navigate('/');
  };

  return (
    <div className="checklist-wrapper">
      <form onSubmit={handleApply} className="cadastro-form">
        <div className="checklist-container" style={{ marginBottom: "24px" }}>
          <h1 className="checklist-title">Seja um Médico Parceiro</h1>
          <p className="checklist-subtitle">Preencha o formulário abaixo para solicitar acesso ao sistema do Instituto Buko Kaesemodel.</p>

          <div className="cadastro-grid">
            <ItemCadastro label="Nome Completo" name="nomeCompleto" required />
            <ItemCadastro label="CRM" name="crm" required />
            <ItemCadastro label="Especialidade" name="especialidade" required />
            <ItemCadastro label="Estado (UF)" name="estado" required />
            <ItemCadastro label="E-mail profissional" name="email" type="email" required />
            <ItemCadastro label="Telefone para contato" name="telefone" type="tel" required />
          </div>

          <div style={{ marginTop: '24px' }}>
            <ItemCadastro label="Link para Currículo Lattes ou LinkedIn (Opcional)" name="linkCurriculo" type="url" />
          </div>
        </div>

        <div className="form-actions" style={{ gap: '16px' }}>
          <BotaoInicio label="Cancelar" />
          <button type="submit" className="checklist-submit-btn">
            Enviar Solicitação
          </button>
        </div>
      </form>
    </div>
  );
};

export default AplicacaoMedico;
