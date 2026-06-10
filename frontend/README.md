# Integração com Banco de Dados - Fluxo e Arquivos

Este documento lista as etapas de navegação do usuário no front-end atual, identificando os arquivos responsáveis por cada tela e **onde exatamente no código** o Banco de Dados (DB) deve ser integrado, substituindo os dados estáticos/mocks.

## 1. Landing Page (Página Inicial)
- **Arquivos:** `src/App.tsx`, `src/components/LandingPage/*` (`Navbar.tsx`, `Hero.tsx`, `QuemSomos.tsx`, `Carrossel/Carrossel.tsx`, `Footer.tsx`).
- **Onde mudar para DB:** 
  - `src/components/LandingPage/QuemSomos/QuemSomos.tsx`: Caso a equipe e parceiros não sejam estáticos, substituir a constante `DADOS_CARDS` vinda de `src/constants/constantes.ts`.
  - `src/components/LandingPage/Navbar/Navbar.tsx`: O botão de login atualmente aceita a prop `usuarioLogado`.

## 2. Autenticação (Login)
- **Arquivo:** `src/App.tsx` e `src/components/LandingPage/Navbar/Navbar.tsx`
- **Onde mudar para DB:** 
  - A autenticação atual é simulada pelo estado `dashboardAberto` no `App.tsx` (linha 14). 
  - A ação de login (`onLoginClick`) no componente `Navbar` apenas altera este estado. É necessário implementar um fluxo real de autenticação (ex: formulário de login/modal) e validar credenciais com o backend antes de permitir o acesso ao Dashboard.

## 3. Controle de Acesso ao Dashboard
- **Arquivo:** `src/components/Dashboard/Dashboard.tsx`
- **Onde mudar para DB:**
  - O cargo do usuário está mockado na constante `const [userRole] = useState('admin');` (linha 17). 
  - Substituir por um cargo (ex: `admin`, `medic`, `patient`) vindo dinamicamente da sessão autenticada.
  - Para cadastro de médicos, substituir o placeholder `[Integração BD: Formulário de Cadastro de Médicos]` pelo formulário respectivo.

## 4. Lista de Pacientes (Padrão do Dashboard)
- **Arquivo:** `src/components/Dashboard/PatientList/PatientList.tsx`
- **Onde mudar para DB:** 
  - Procurar pela constante `MOCK_PATIENTS_DATA` demarcada pelo comentário `🚨 MOCK DATA 🚨`. 
  - Substituir o uso dessa constante (linha 22: `useState<Patient[]>(MOCK_PATIENTS_DATA)`) por dados puxados da API.

## 5. Prontuário / Detalhes do Paciente
- **Arquivo:** `src/components/Dashboard/PatientCard/PatientCard.tsx`
- **Onde mudar para DB:**
  - Substituir o texto `[Foto BD]` (linha 33) pela foto real do paciente.
  - Remover a `<div>` com a classe `patient-card-db-placeholder` dentro da seção "Histórico de Consultas", demarcada por `🚨 MOCK DATA 🚨`, e substituir pelos dados vindos da API.
  - Substituir os placeholders `[Integração BD: Exames]` e `[Integração BD: Pacientes Relacionados]` pelas respectivas lógicas e componentes.

## 6. Formulário de Cadastro de Pacientes
- **Arquivo:** `src/components/Dashboard/PatientForm/PatientForm.tsx`
- **Onde mudar para DB:**
  - Substituir as `<div>` que possuem a classe `.patient-form-db-placeholder` e textos como `[Integração BD: Inputs Básicos]`, `[Integração BD: Checkboxes de Sintomas]` e `[Lógica de Importação com Permissão Admin]` por campos reais que realizem chamadas de API (POST/PUT).

## 7. Relatórios
- **Arquivo:** `src/components/Dashboard/Reports/Reports.tsx`
- **Onde mudar para DB:**
  - Substituir a `<div>` contendo o texto `[Integração BD: Filtros de Relatórios]` pelas opções de filtro e lógica de requisição dos relatórios da API.

## 8. Log de Auditoria
- **Arquivo:** `src/components/Dashboard/AuditLog/AuditLog.tsx`
- **Onde mudar para DB:**
  - Substituir o texto `[Integração BD: Filtros de Auditoria]` pelos filtros reais.
  - Na tabela, substituir a linha estática "Os dados aparecerão aqui quando conectados ao endpoint..." pelas entradas de log retornadas pelo DB.