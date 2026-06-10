import React, { useState, useEffect } from 'react';

// ==========================================
// 1. SIDEBAR COMPONENT
// ==========================================
interface Patient {
  id: number | string;
  name: string;
  age: number;
  sex: string;
  lastConsultation: string;
  tag?: string;
  responsibleFigure?: string;
  phone?: string;
}

interface SidebarProps {
  isOpen: boolean;
  role: string;
  setView: (view: string) => void;
  onLogout?: () => void;
}
const Sidebar = ({ isOpen, role, setView, onLogout }: SidebarProps) => {
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : '-250px',
    width: '250px',
    height: '100vh',
    background: '#ffffff',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    transition: 'left 0.3s ease',
    padding: '60px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 999
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333'
  };

  return (
    <aside style={sidebarStyle}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {['medic', 'institute', 'admin'].includes(role) && (
          <>
            <button style={btnStyle} onClick={() => setView('patients')}>Patient List</button>
            <button style={btnStyle} onClick={() => setView('register')}>Register Patient</button>
          </>
        )}
        {['institute', 'admin'].includes(role) && (
          <button style={btnStyle} onClick={() => setView('reports')}>Reports</button>
        )}
        {role === 'admin' && (
          <>
            <button style={btnStyle} onClick={() => setView('audit')}>Audit Log</button>
            <button style={btnStyle} onClick={() => setView('medRegistration')}>Medic Registration</button>
          </>
        )}
        {role === 'patient' && (
           <button style={btnStyle} onClick={() => setView('support')}>Support</button>
        )}
      </nav>
      <button 
        onClick={onLogout} 
        style={{ ...btnStyle, marginTop: 'auto', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', textAlign: 'center' }}
      >
        Logout
      </button>
    </aside>
  );
};

// ==========================================
// 2. PATIENT LIST COMPONENT
// ==========================================
interface PatientListProps {
  onPatientClick: (patient: Patient) => void;
  role: string;
}
const PatientList = ({ onPatientClick, role }: PatientListProps) => {
  const [patients, setPatients] = useState<Patient[]>([]); // Awaits DB population

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2>{role === 'medic' ? 'My Patients' : 'All Patients'}</h2>
      <div style={{ height: '40px', background: '#f9f9f9', border: '1px dashed #ccc', margin: '15px 0', display: 'flex', alignItems: 'center', padding: '0 10px', color: '#888' }}>
        [Search and Filter API Integration Point]
      </div> 
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Age</th>
            <th style={{ padding: '10px' }}>Sex</th>
            <th style={{ padding: '10px' }}>Last Consultation</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No patients found. Database empty.</td></tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} onClick={() => onPatientClick(patient)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{patient.name}</td>
                <td style={{ padding: '10px' }}>{patient.age}</td>
                <td style={{ padding: '10px' }}>{patient.sex}</td>
                <td style={{ padding: '10px' }}>{patient.lastConsultation}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================
// 3. PATIENT CARD COMPONENT
// ==========================================
interface PatientCardProps {
  patient: Patient;
  onClose: () => void;
  role: string;
}
const PatientCard = ({ patient, onClose, role }: PatientCardProps) => {
  const handleWhatsAppRedirect = (phone?: string) => {
    if(phone) window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <button onClick={onClose} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>← Back to List</button>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '150px', height: '150px', background: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
           [Picture DB]
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h2>{patient.name || 'Patient Name'}</h2>
          <div style={{ display: 'inline-block', padding: '4px 8px', background: '#e6f7ff', borderRadius: '4px', marginBottom: '15px', fontSize: '12px' }}>
            Tag: {patient.tag || 'None'}
          </div>
          <p><strong>Responsible Figure:</strong> {patient.responsibleFigure || 'N/A'}</p>
          <button 
            onClick={() => handleWhatsAppRedirect(patient?.phone)}
            style={{ background: '#25D366', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
          >
            Contact via WhatsApp
          </button>
        </div>
      </div>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <div style={{ textAlign: 'left' }}>
        <h3>Exam Requiry</h3>
        <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc' }}>[Exam DB Integration]</div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h3>Related Patients</h3>
        <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc' }}>[Related Patients DB Integration]</div>
      </div>

      {role === 'patient' && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#fef0f0', borderRadius: '8px', textAlign: 'left' }}>
          <h3>Support Card</h3>
          <p>Need help? Contact our support team.</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. PATIENT FORM COMPONENT
// ==========================================
interface PatientFormProps {
  onCancel: () => void;
  role: string;
}
const PatientForm = ({ onCancel, role }: PatientFormProps) => {
  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'left' }}>
      <h2>Register New Patient</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
           <label style={{ fontWeight: 'bold' }}>Basic Info</label>
           <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc' }}>[Basic Info Inputs DB]</div>
        </div>
        <div>
           <label style={{ fontWeight: 'bold' }}>Symptom Checklist</label>
           <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc' }}>[Symptoms Checkboxes DB]</div>
        </div>
        {role === 'medic' && (
          <div>
             <label style={{ fontWeight: 'bold' }}>Import Database</label>
             <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc' }}>[Admin Permission Import Logic]</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="button" style={{ background: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>Save Patient</button>
          <button type="button" onClick={onCancel} style={{ background: '#ccc', padding: '10px 20px', border: 'none', borderRadius: '4px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// 5. REPORTS COMPONENT
// ==========================================
const Reports = () => {
  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'left' }}>
      <h2>System Reports</h2>
      <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc', margin: '20px 0' }}>
        [Report Filters DB Integration]
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button style={{ padding: '10px 20px', background: '#107c41', color: '#fff', border: 'none', borderRadius: '4px' }}>Download CSV</button>
        <button style={{ padding: '10px 20px', background: '#b30b00', color: '#fff', border: 'none', borderRadius: '4px' }}>Download PDF</button>
      </div>
    </div>
  );
};

// ==========================================
// 6. AUDIT LOG COMPONENT
// ==========================================
const AuditLog = () => {
  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'left' }}>
      <h2>System Audit Log</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Track all administrative, medical, and system actions.</p>
      <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc', marginBottom: '20px' }}>
        [Audit Filters DB Integration]
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px' }}>Timestamp</th>
            <th style={{ padding: '10px' }}>User / Role</th>
            <th style={{ padding: '10px' }}>Action</th>
            <th style={{ padding: '10px' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
              Data will populate here once connected to the Audit API endpoint.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ==========================================
// MAIN DASHBOARD WRAPPER
// ==========================================
interface DashboardProps {
  onLogout?: () => void;
}
const Dashboard = ({ onLogout }: DashboardProps) => {
  // Hardcoded to 'admin' so you can see all menu options. 
  // Change this to 'medic', 'institute', or 'patient' to test permissions.
  const [userRole] = useState('admin'); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('patients'); 
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    if (selectedPatient) {
      return <PatientCard patient={selectedPatient} onClose={() => setSelectedPatient(null)} role={userRole} />;
    }

    switch (currentView) {
      case 'patients':
        return <PatientList onPatientClick={setSelectedPatient} role={userRole} />;
      case 'register':
        return <PatientForm onCancel={() => setCurrentView('patients')} role={userRole} />;
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditLog />;
      case 'medRegistration':
        return (
          <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'left' }}>
            <h2>Medic Registration</h2>
            <div style={{ padding: '20px', background: '#f9f9f9', color: '#999', borderRadius: '4px', border: '1px dashed #ccc', marginTop: '20px' }}>
              [Medic Registration Form DB Integration]
            </div>
          </div>
        );
      default:
        return <PatientList onPatientClick={setSelectedPatient} role={userRole} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hamburger Toggle */}
      <button 
        onClick={toggleSidebar} 
        style={{ 
          position: 'fixed', 
          top: '15px', 
          left: '15px', 
          zIndex: 1000, 
          background: '#1a5fa8', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          padding: '8px 12px', 
          cursor: 'pointer' 
        }}
      >
        ☰ Menu
      </button>

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        role={userRole} 
        setView={(view) => { setCurrentView(view); setSelectedPatient(null); setIsSidebarOpen(false); }}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: '80px 20px 40px', // Pushed down to clear hamburger
        display: 'flex', 
        justifyContent: 'center', 
        marginLeft: isSidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;