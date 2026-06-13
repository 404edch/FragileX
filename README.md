# Projeto Eu Digo X - Instituto Buko Kaesemodel

Este repositório contém a aplicação web completa (Full-Stack) desenvolvida para o projeto **Eu Digo X**, iniciativa do **Instituto Buko Kaesemodel**. O objetivo principal da plataforma é conscientizar sobre a Síndrome do X Frágil, além de fornecer uma ferramenta robusta para cadastro e acompanhamento de pacientes, médicos e relatórios clínicos (Dashboard Administrativo e Médico).

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** com **TypeScript**
- **Vite** (Build tool e Dev Server)
- **React Router** (Navegação)
- **Recharts** (Gráficos e dashboards)
- **GSAP & Motion** (Animações fluidas)

### Backend
- **Node.js** com **Express** e **TypeScript**
- **PostgreSQL** (Banco de Dados Relacional via `pg`)
- **JWT (JSON Web Token)** e **Bcryptjs** (Autenticação e Segurança)
- **CORS** (Controle de acesso à API)

---

## 📂 Estrutura do Repositório

O projeto adota uma arquitetura de monorepo separando as responsabilidades:

- `/frontend`: Aplicação do lado do cliente (Landing Page pública, formulários interativos, dashboard do paciente, médico e administrador).
- `/backend`: API RESTful responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.
- `/shared`: Arquivos, tipagens e utilitários que podem ser compartilhados entre frontend e backend.

---

## 🛠️ Como Configurar e Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendada)
- Banco de Dados [PostgreSQL](https://www.postgresql.org/) rodando localmente ou remotamente.

### 1. Configurando o Banco de Dados (Backend)
1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do `backend` com as credenciais do seu banco de dados:
   ```env
   DB_USER=seu_usuario
   DB_HOST=localhost
   DB_DATABASE=seu_banco
   DB_PASSWORD=sua_senha
   DB_PORT=5432
   JWT_SECRET=sua_chave_secreta_aqui
   ```
4. Inicialize o banco de dados rodando os scripts SQL localizados em `backend/src/models/db.sql` para criar as tabelas, e `backend/src/models/seed.sql` para popular com os dados iniciais.
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
   *(O backend estará rodando, geralmente, na porta configurada ou na padrão 3000)*.

### 2. Rodando a Interface de Usuário (Frontend)
1. Em um novo terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação no modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o frontend no seu navegador acessando o link fornecido no terminal (geralmente `http://localhost:5173`).

---

## 🔐 Acessos Iniciais Padrão (Seed)
Caso você tenha rodado o `seed.sql`, alguns usuários estarão disponíveis por padrão para testar os diferentes perfis (Role):

- **Senha Padrão para todos:** `123456`
- Administrador Institucional: `instituto@teste.com` ou e-mails específicos do instituto.
- Médico: `medico@teste.com`
- Paciente: `paciente@teste.com`

*(Verifique o arquivo `seed.sql` para visualizar a lista completa de usuários e credenciais)*.

---

## 📜 Licença e Termos
Este sistema é de uso do Instituto Buko Kaesemodel. Todos os direitos reservados de acordo com o contrato ou licença especificada no repositório.
