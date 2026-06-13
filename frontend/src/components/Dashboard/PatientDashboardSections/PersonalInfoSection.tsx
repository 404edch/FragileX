import React from "react";
import "../PatientDashboard.css";

interface PersonalInfoSectionProps {
  usuarioInfo: {
    nome: string;
    cpf: string;
    email: string;
  };
  paciente: {
    foto_perfil?: string | null;
    responsavel_nome?: string | null;
    responsavel_parentesco?: string | null;
    data_nascimento: string;
    sexo_biologico: string;
    genero: string;
    cidade?: string | null;
    estado?: string | null;
    pais?: string | null;
  };
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ usuarioInfo, paciente }) => {
  const calcularIdade = (dataNasc: string) => {
    try {
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      return isNaN(idade) ? "N/A" : `${idade} anos`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="dashboard-med-registration patient-section-card">
      <h3 className="patient-section-header">Dados Pessoais</h3>
      <div className="patient-info-content">
        <div className="patient-photo-container">
          {paciente.foto_perfil ? (
            <img src={paciente.foto_perfil} alt="Foto do Paciente" className="patient-photo" />
          ) : (
            <div className="patient-photo-placeholder">Sem Foto</div>
          )}
        </div>

        <div className="patient-details">
          <p>
            <strong>Nome Completo:</strong> {usuarioInfo.nome}
          </p>
          <p>
            <strong>Responsável:</strong> {paciente.responsavel_nome} ({paciente.responsavel_parentesco})
          </p>
          <p>
            <strong>Idade:</strong> {calcularIdade(paciente.data_nascimento)} | <strong>Nascimento:</strong> {paciente.data_nascimento}
          </p>
          <p>
            <strong>Sexo Biológico:</strong> {paciente.sexo_biologico} | <strong>Gênero:</strong> {paciente.genero}
          </p>
          <p>
            <strong>CPF:</strong> {usuarioInfo.cpf}
          </p>
          <p>
            <strong>Cidade/UF:</strong> {paciente.cidade} - {paciente.estado}
          </p>
          <p>
            <strong>País:</strong> {paciente.pais}
          </p>
          <p>
            <strong>E-mail:</strong> {usuarioInfo.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
