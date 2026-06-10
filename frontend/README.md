# Integração com Banco de Dados - Fluxo e Arquivos

Este documento lista as etapas de navegação do usuário no front-end atual, identificando os arquivos responsáveis por cada tela e **onde exatamente no código** o Banco de Dados (DB) deve ser integrado, substituindo os dados estáticos/mocks.

## 1. Landing Page (Página Inicial)
- **Arquivos:** `src/App.tsx`, `src/components/LandingPage/*` (`Hero.tsx`, `QuemSomos.tsx`, `Carrossel.tsx`, `Footer.tsx`).
- **Onde mudar para DB:** 
  - `src/components/LandingPage/QuemSomos/QuemSomos.tsx`: Caso a equipe e parceiros não sejam estáticos, substituir a constante `DADOS_CARDS` vinda de `src/constants/constantes.ts`.

## 2. Autenticação (Login)
- **Arquivo:** `src/components/Auth/Login/Login.tsx`
- **Onde mudar para DB:** 
  - Na função `handleSubmit`, remover o `setTimeout` na linha 44 que simula o tempo de rede.
  - Inserir a chamada real de autenticação com banco de dados usando as variáveis de estado `email` e `senha`.

## 3. Controle de Acesso ao Dashboard
- **Arquivo:** `src/components/Dashboard/Dashboard.tsx`
- **Onde mudar para DB:**
  - O cargo do usuário está mockado na constante `const [userRole] = useState('admin');` (linha 17). 
  - Substituir por um cargo (ex: `admin`, `medic`) vindo dinamicamente da sessão do DB/Login.

## 4. Lista de Pacientes (Padrão do Dashboard)
- **Arquivo:** `src/components/Dashboard/PatientList/PatientList.tsx`
- **Onde mudar para DB:** 
  - Procurar pela constante `MOCK_PATIENTS` demarcada pelo comentário `🚨 MOCK DATA 🚨`. 
  - Substituir esta constante por dados puxados do DB.

## 5. Prontuário / Detalhes do Paciente
- **Arquivo:** `src/components/Dashboard/PatientCard/PatientCard.tsx`
- **Onde mudar para DB:**
  - Procurar pela constante `CONSULTATION_HISTORY` demarcada pelo comentário `🚨 MOCK DATA 🚨`.
  - Substituir os dados estáticos pelo histórico de consultas do DB pertinente ao paciente selecionado.

## 6. Formulário de Cadastro de Pacientes
- **Arquivo:** `src/components/Dashboard/PatientForm/PatientForm.tsx`
- **Onde mudar para DB:**
  - Substituir as `<div>` que possuem a classe `.patient-form-db-placeholder` e textos como `[Integração BD: Inputs Básicos]` e `[Integração BD: Checkboxes de Sintomas]` por campos de formulário reais que enviem POST para o DB.

## 7. Relatórios
- **Arquivo:** `src/components/Dashboard/Reports/Reports.tsx`
- **Onde mudar para DB:**
  - Substituir a `<div>` contendo o texto `[Integração BD: Filtros de Relatórios]` pelas opções de filtro e lógica de requisição dos relatórios.

## 8. Log de Auditoria
- **Arquivo:** `src/components/Dashboard/AuditLog/AuditLog.tsx`
- **Onde mudar para DB:**
  - Substituir a tabela vazia que diz `[Integração BD: Filtros de Auditoria]` e a linha estática "Os dados aparecerão aqui quando conectados ao endpoint..." pelas entradas puxadas do DB contendo os logs do sistema.