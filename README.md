# FragileX 🧬

A digital support platform, designed to streamline the early diagnosis of **Fragile X Syndrome** through clinical scoring, secure patient management, and intelligent PCR referral workflows.

---

## 📖 About the Project

Fragile X Syndrome is one of the leading hereditary causes of intellectual disability. Many patients are currently referred for expensive molecular PCR testing without completing an adequate clinical pre-screening, increasing healthcare costs and overwhelming diagnostic services.

**FragileX** digitizes a **validated clinical checklist** and automates it's scoring algorithm. The platform evaluates **12 clinically significant symptoms**, applying sex-specific weighting to calculate the probability of Fragile X Syndrome.

Patients with scores above the clinical threshold are automatically flagged for molecular testing, allowing the prioritization of high-probability cases while maintaining complete administrative oversight.

---
# 🚀 Getting Started

This project runs with a single command from the root folder, but requires proper database and environment setup before execution.

---

## 📦 Installation

Clone the repository:

```bash id="cl1"
git clone https://github.com/your-username/FragileX.git
cd FragileX
```

Install dependencies for both frontend and backend:

```bash id="cl2"
cd frontend
npm install

cd ../backend
npm install
```

---

## 🗄 Database Setup

Create a PostgreSQL database and configure it using the schema and seed files located in:

```
backend/src/models
```

This folder contains:

* Database schema definitions
* Seed scripts (if applicable)

---

## 🔐 Environment Variables

Before running the project, you **must** create a `.env` file inside the `backend` folder.

The backend uses these variables for database and authentication setup:

```env id="env1"
DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=fragilex
JWT_SECRET=your_super_secure_jwt_secret
```

### Variable explanation:

* **DATABASE_HOST** → PostgreSQL server host (e.g. `localhost` or cloud provider)
* **DATABASE_USER** → Database username
* **DATABASE_PASSWORD** → Database password
* **DATABASE_NAME** → Name of the PostgreSQL database
* **JWT_SECRET** → Secret key used to sign and verify JWT authentication tokens (keep this secure)

> ⚠️ If any of these variables are missing or incorrect, the backend will fail to start or authenticate users properly.

---

## ▶️ Running the Project

From the root folder, simply run:

```bash id="run1"
npm run dev
```

This starts both the **frontend and backend servers simultaneously**.

---

## ⚙️ Notes

* Database connection is handled in `backend/src/config`
* PostgreSQL default port is `5432` (hardcoded)
* Ensure PostgreSQL is running before starting the backend
  
---

## ✨ Features

### 🔬 Clinical Decision Support

* Automated symptom scoring using the clinical algorithm
* Sex-adjusted weighting for all 12 symptoms
* Configurable diagnostic thresholds

  * **Male:** ≥ 0.56
  * **Female:** ≥ 0.55
* Approximately **95% clinical sensitivity** for both sexes

### 👥 Multi-Role Platform

Role-based dashboards for:

* Patients / Families
* Doctors
* IBK Staff
* Administrators

### 🔗 Consent-Based Doctor Access

Doctors can only access a patient's medical information after explicit approval from the patient, ensuring compliance with privacy regulations.

### 🏥 Doctor Credentialing

New physicians enter a verification workflow where CRM credentials are reviewed before receiving access to the platform.

### 📋 Clinical History

* Complete checklist history
* Medical evaluations
* Previous diagnoses
* Patient scores remain hidden from patients to discourage self-diagnosis while remaining accessible to authorized healthcare professionals.

### 🚨 PCR Referral Dashboard

Automatically generated queue of suspected Fragile X cases requiring PCR testing, including physician-approved referral overrides.

### 📁 Persistent Medical Records

Medical exams, documents, and clinical notes remain permanently linked to the patient's account, independent of doctor-patient association status.

### 📊 Administrative Reports

* Statistical dashboards
* Filtering by multiple criteria
* Excel export
* Institutional analytics

### 🛡️ Audit Logging

Immutable audit trail of administrative actions to support legal compliance and LGPD requirements.

### 📰 Content Management System

Staff can update the public landing page without modifying the application source code.

---

## 🔐 Authentication & Security

* JWT (JSON Web Token) authentication
* Protected API routes using authentication middleware
* Role-Based Access Control (RBAC)
* Password hashing with bcryptjs
* Secure authorization middleware
* Input validation and request sanitization

---

## 🛠 Tech Stack

| Layer          | Technology                        |
| -------------- | --------------------------------- |
| Frontend       | React + TypeScript + Vanilla CSS  |
| Backend        | Node.js + Express.js + TypeScript |
| Database       | PostgreSQL                        |
| Authentication | JWT                               |
| Security       | bcryptjs, RBAC, Protected Routes  |

---

## 🗄 Database Architecture

The database follows a **Class Table Inheritance (CTI)** approach, where a central `usuarios` table stores shared user information while specialized child tables maintain role-specific data.

### Example Design Decisions

* **usuarios**

  * Base user entity shared across every account.

* **medicos**

  * Doctor-specific information and credentials.

* **pacientes**

  * Patient demographic and clinical information.

* **funcionarios_ibk**

  * Institute staff accounts.

* **sintomas**

  * Clinical dictionary containing configurable symptom weights, allowing medical adjustments without source code modifications.

* **notificacoes_pcr**

  * Precomputed PCR referral queue consumed directly by the administrative dashboard.

* **solicitacoes_credenciamento**

  * Quarantine table isolating newly registered physicians until manual approval.

* **logs_auditoria**

  * Immutable audit records for administrative actions and compliance.

---

## 🏗 System Architecture

* React SPA frontend
* RESTful Express API
* PostgreSQL relational database
* JWT-based authentication
* RBAC authorization layer
* Protected API endpoints
* Clinical scoring engine
* Administrative reporting module

---

## 🚀 Future Improvements

* Email notifications
* Multi-factor authentication
* Medical imaging support
* Dashboard analytics enhancements
* Internationalization (i18n)
* Mobile application

---

## 👨‍💻 Authors

* Bruno Rogerio Coutinho Moretoni
* Eduardo Henrique Chechin Teixeira
* Lunna Damo Perera

---

## 📄 License

This project was developed for academic purposes in collaboration with **Instituto Buko Kaesemodel (IBK)**.
