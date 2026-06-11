import { useParams } from "react-router-dom";
import PatientCard from "./PatientCard/PatientCard";
import { MOCK_PATIENTS_DATA } from "./mockData";

export default function PatientCardPage() {
  const { id } = useParams();
  const patientId = id ? (isNaN(Number(id)) ? id : Number(id)) : null;
  const patient = MOCK_PATIENTS_DATA.find(p => p.id === patientId);

  if (patient) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <PatientCard patient={patient} onClose={() => window.close()} role="patient" />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ padding: 20, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Paciente não encontrado.</h2>
      </div>
    );
  }
}
