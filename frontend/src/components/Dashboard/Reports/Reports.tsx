import React, { useState, useEffect, useMemo } from 'react';
import { patientService } from '../../../services/patientService';
import { userService } from '../../../services/userService';
import { MockUsuario, MockPaciente } from '../../../services/types';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#f43f5e'];

export default function Reports() {
  const [patients, setPatients] = useState<(MockUsuario & { pacienteDetails?: MockPaciente })[]>([]);
  const [doctors, setDoctors] = useState<MockUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTriagem, setFilterTriagem] = useState('');
  const [filterSexo, setFilterSexo] = useState('');
  const [filterMedico, setFilterMedico] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, usersData] = await Promise.all([
          patientService.listarTodosPacientes(),
          userService.listarTodosUsuarios()
        ]);
        setPatients(patientsData);
        setDoctors(usersData.filter(u => u.role === 'medico'));
      } catch (error) {
        console.error("Erro ao carregar dados para relatório:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const det = p.pacienteDetails;
      if (filterStatus && det?.encaminhamento_status !== filterStatus) return false;
      
      if (filterTriagem) {
        if (det?.classificacao_oficial !== filterTriagem) return false;
      }
      
      if (filterSexo) {
        const isFemale = det?.sexo_biologico === 'F';
        if (filterSexo === 'F' && !isFemale) return false;
        if (filterSexo === 'M' && isFemale) return false; 
      }
      
      if (filterMedico) {
        if (filterMedico === 'com' && !det?.id_medico_responsavel) return false;
        if (filterMedico === 'sem' && det?.id_medico_responsavel) return false;
        if (filterMedico !== 'com' && filterMedico !== 'sem') {
          if (det?.id_medico_responsavel !== Number(filterMedico)) return false;
        }
      }
      
      return true;
    });
  }, [patients, filterStatus, filterTriagem, filterSexo, filterMedico]);

  const stats = useMemo(() => {
    let pendente = 0, encaminhado = 0, negado = 0;
    let suspeito = 0, negativo = 0, naoAvaliado = 0;
    let masculino = 0, feminino = 0;
    let semMedico = 0;

    filteredPatients.forEach(p => {
      // Status de Encaminhamento
      const st = p.pacienteDetails?.encaminhamento_status;
      if (st === 'encaminhado') encaminhado++;
      else if (st === 'encaminhamento negado') negado++;
      else pendente++;

      // Triagem / Classificação Oficial
      const classif = p.pacienteDetails?.classificacao_oficial || 'Não Avaliado';
      if (classif === 'Suspeito') suspeito++;
      else if (classif === 'Negativo') negativo++;
      else naoAvaliado++;

      // Gênero
      const gen = p.pacienteDetails?.sexo_biologico;
      if (gen === 'F') feminino++;
      else masculino++;

      // Sem Médico
      if (!p.pacienteDetails?.id_medico_responsavel) semMedico++;
    });

    return {
      statusData: [
        { name: 'Pendente', value: pendente },
        { name: 'Encaminhado', value: encaminhado },
        { name: 'Negado', value: negado },
      ].filter(item => item.value > 0),
      triagemData: [
        { name: 'Suspeito', value: suspeito },
        { name: 'Negativo', value: negativo },
        { name: 'Não Avaliado', value: naoAvaliado },
      ].filter(item => item.value > 0),
      generoData: [
        { name: 'Masculino', value: masculino },
        { name: 'Feminino', value: feminino },
      ].filter(item => item.value > 0),
      semMedico
    };
  }, [filteredPatients]);

  const handleExportExcel = () => {
    const dataToExport = filteredPatients.map(p => ({
      'Nome': p.nome,
      'CPF': p.cpf,
      'E-mail': p.email,
      'Data de Nascimento': p.pacienteDetails?.data_nascimento ? new Date(p.pacienteDetails.data_nascimento).toLocaleDateString('pt-BR') : 'N/A',
      'Sexo Biológico': p.pacienteDetails?.sexo_biologico || 'N/A',
      'Gênero Declarado': p.pacienteDetails?.genero || 'N/A',
      'Resultado da Triagem': p.pacienteDetails?.classificacao_oficial || 'Não Avaliado',
      'Status de Encaminhamento': p.pacienteDetails?.encaminhamento_status || 'pendente',
      'Acompanhamento Médico': p.pacienteDetails?.id_medico_responsavel 
        ? (doctors.find(d => d.id === p.pacienteDetails?.id_medico_responsavel)?.nome || 'Sim') 
        : 'Não'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
    XLSX.writeFile(wb, "Relatorio_Pacientes_FragileX.xlsx");
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando dados para o relatório...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#ffffff', fontWeight: 'bold' }}>Painel de Relatórios</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Visão geral dos pacientes cadastrados no sistema.</p>
        </div>
      </div>

      {/* Seção de Filtros */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#334155' }}>Filtros de Pesquisa</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Status de Encaminhamento</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="encaminhado">Encaminhado</option>
              <option value="encaminhamento negado">Negado</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Resultado da Triagem</label>
            <select value={filterTriagem} onChange={e => setFilterTriagem(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Todas</option>
              <option value="Suspeito">Suspeito (≥ Limiar)</option>
              <option value="Negativo">Negativo (&lt; Limiar)</option>
              <option value="Não Avaliado">Não Avaliado</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Sexo Biológico</label>
            <select value={filterSexo} onChange={e => setFilterSexo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#475569', fontWeight: 'bold' }}>Acompanhamento Médico</label>
            <select value={filterMedico} onChange={e => setFilterMedico(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Todos</option>
              <option value="com">Com Médico (Qualquer)</option>
              <option value="sem">Sem Médico Responsável</option>
              {doctors.length > 0 && (
                <optgroup label="Médicos Específicos">
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Total Filtrado</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{filteredPatients.length}</p>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>S/ Acompanhamento</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#e11d48' }}>{stats.semMedico}</p>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Encaminhados</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
            {stats.statusData.find(s => s.name === 'Encaminhado')?.value || 0}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px', color: '#334155', fontSize: '16px' }}>Status de Encaminhamento</h3>
          <div style={{ width: '100%', height: 250 }}>
            {stats.statusData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Sem dados</div>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px', color: '#334155', fontSize: '16px' }}>Resultado da Triagem (PCR)</h3>
          <div style={{ width: '100%', height: 250 }}>
            {stats.triagemData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.triagemData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.triagemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Sem dados</div>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px', color: '#334155', fontSize: '16px' }}>Sexo Biológico</h3>
          <div style={{ width: '100%', height: 250 }}>
            {stats.generoData.length > 0 ? (
              <ResponsiveContainer>
                <BarChart data={stats.generoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {stats.generoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Sem dados</div>
            )}
          </div>
        </div>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 8px', color: '#334155', fontSize: '20px', fontWeight: 'bold' }}>Baixar Relatório</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Exporte os dados completos dos pacientes correspondentes aos filtros selecionados.</p>
          </div>
          <button 
            onClick={handleExportExcel}
            style={{ width: '80%', padding: '16px', fontSize: '16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
          >
            📄 Exportar Planilha Excel
          </button>
        </div>
      </div>
    </div>
  );
}
