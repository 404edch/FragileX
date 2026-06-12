import React, { useState, useEffect, useMemo } from 'react';
import { backendService, type MockUsuario, type MockPaciente } from '../../../services/backendService';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#f43f5e'];

export default function Reports() {
  const [patients, setPatients] = useState<(MockUsuario & { pacienteDetails?: MockPaciente })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await backendService.listarTodosPacientes();
        setPatients(data);
      } catch (error) {
        console.error("Erro ao carregar pacientes para relatório:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const stats = useMemo(() => {
    let pendente = 0, encaminhado = 0, negado = 0;
    let normal = 0, preMutacao = 0, mutacao = 0;
    let masculino = 0, feminino = 0;
    let semMedico = 0;

    patients.forEach(p => {
      // Status de Encaminhamento
      const st = p.pacienteDetails?.encaminhamento_status;
      if (st === 'encaminhado') encaminhado++;
      else if (st === 'encaminhamento negado') negado++;
      else pendente++;

      // Síndrome
      const sin = p.pacienteDetails?.sindrome;
      if (sin === 'mutacao') mutacao++;
      else if (sin === 'pre_mutacao') preMutacao++;
      else normal++;

      // Gênero
      const gen = p.pacienteDetails?.genero;
      if (gen === 'Feminino' || gen === 'feminino') feminino++;
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
      sindromeData: [
        { name: 'Normal', value: normal },
        { name: 'Pré-Mutação', value: preMutacao },
        { name: 'Mutação', value: mutacao },
      ].filter(item => item.value > 0),
      generoData: [
        { name: 'Masculino', value: masculino },
        { name: 'Feminino', value: feminino },
      ].filter(item => item.value > 0),
      semMedico
    };
  }, [patients]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando dados para o relatório...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0f172a' }}>Painel de Relatórios</h2>
        <p style={{ margin: 0, color: '#64748b' }}>Visão geral dos pacientes cadastrados no sistema.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Total de Pacientes</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{patients.length}</p>
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
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px', color: '#334155', fontSize: '16px' }}>Distribuição de Síndrome</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.sindromeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {stats.sindromeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px', color: '#334155', fontSize: '16px' }}>Gênero Declarado</h3>
          <div style={{ width: '100%', height: 250 }}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
