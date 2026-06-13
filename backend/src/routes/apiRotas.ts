import { Router } from "express";
import * as userController from "../controllers/userController";
import * as patientController from "../controllers/patientController";
import * as linkController from "../controllers/linkController";
import * as doctorController from "../controllers/doctorController";
import * as landingController from "../controllers/landingController";
import * as auditController from "../controllers/auditController";
import * as checklistController from "../controllers/checklistController";
import * as notificacaoController from "../controllers/notificacaoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

// ── ROTAS PÚBLICAS ──────────────────────────────────────────────────────────

// Sintomas (usado pelo checklist rápido também)
import { sendSintomas } from "../controllers/sintomasController";
router.get("/sintomas", sendSintomas);

// Login
router.post("/auth/login", userController.login);

// Autocadastro de paciente (qualquer pessoa)
router.post("/patients/autocadastro", patientController.autocadastro);

// Solicitação de credenciamento de médico (qualquer pessoa)
router.post("/doctors/solicitar", doctorController.solicitarCredenciamento);

// Ativação de conta por token (paciente cadastrado pelo médico)
router.get("/patients/validar-token", patientController.validarTokenAtivacao);
router.post("/patients/ativar-conta", patientController.ativarConta);

// Landing Editables (GET public)
router.get("/landing/cards", landingController.getCards);
router.get("/landing/news", landingController.getNews);

// ── ROTAS PROTEGIDAS ─────────────────────────────────────────────────────────

// A partir daqui, todas as rotas exigem JWT válido
router.use(authMiddleware);

// ── Users ──
router.get("/users/:id", userController.getMe);
router.get("/users", requireRole(["instituto", "admin"]), userController.listAll);
router.post("/users/employee", requireRole(["admin"]), userController.createEmployee);
router.put("/users/:id", requireRole(["instituto", "admin"]), userController.update);
router.delete("/users/:id", requireRole(["instituto", "admin"]), userController.remove);

// ── Patients ──
router.get("/patients/check-cpf/:cpf", patientController.checkCpf);

// Médico/instituto cadastram paciente (cria conta PENDING_ACTIVATION)
router.post("/patients/cadastrar-pelo-medico", requireRole(["medico", "instituto"]), patientController.cadastrarPeloMedico);

// Instituto vê todos os pacientes; médico só vê os seus (via listPacientesDoMedico)
router.get("/patients", requireRole(["instituto", "admin"]), patientController.listTodosPacientes);
router.get("/patients/medico/:idMedico", requireRole(["medico", "instituto", "admin"]), patientController.listPacientesDoMedico);
router.put("/patients/:id/status", requireRole(["instituto", "admin"]), patientController.updateStatus);
router.get("/patients/:id", requireRole(["paciente", "medico", "instituto", "admin"]), patientController.getPaciente);
router.get("/patients/cpf/:cpf", requireRole(["medico", "instituto", "admin", "paciente"]), patientController.getPacienteByCpf);

// ── Links (Vínculos médico-paciente) ──
router.post("/links/solicitar", requireRole(["medico"]), linkController.solicitarVinculo);
router.get("/links/paciente/:idPaciente", requireRole(["paciente", "medico", "instituto"]), linkController.listarSolicitacoesVinculoPaciente);
router.post("/links/:id/responder", requireRole(["paciente"]), linkController.responderSolicitacaoVinculo);

// ── Doctors (Credenciamento) ──
router.get("/doctors/solicitacoes", requireRole(["instituto", "admin"]), doctorController.listarSolicitacoesCredenciamento);
router.get("/doctors/solicitacoes/count", requireRole(["instituto", "admin"]), doctorController.contarSolicitacoesPendentes);
router.get("/doctors/:id", requireRole(["medico", "instituto", "admin"]), doctorController.getMedico);
router.post("/doctors/solicitacoes/:id/responder", requireRole(["instituto", "admin"]), doctorController.responderSolicitacaoCredenciamento);
router.post("/doctors/registrar-direto", requireRole(["instituto", "admin"]), doctorController.registrarMedicoDireto);

// ── Landing Editables (POST protected) ──
router.post("/landing/cards", requireRole(["instituto", "admin"]), landingController.saveCards);
router.post("/landing/news", requireRole(["instituto", "admin"]), landingController.saveNews);

// ── Audit ──
router.get("/audits", requireRole(["instituto", "admin"]), auditController.getAudits);

// ── Checklists ──
router.post("/checklists", requireRole(["medico", "instituto", "paciente", "admin"]), checklistController.salvarChecklist);
router.get("/checklists/search", requireRole(["instituto", "admin"]), checklistController.buscarChecklistsAvancado);
router.get("/checklists/paciente/:idPaciente", requireRole(["medico", "instituto", "paciente", "admin"]), checklistController.obterChecklistsPaciente);
router.get("/checklists/detalhes/:id", requireRole(["instituto", "admin", "paciente"]), checklistController.obterChecklistPorId);
router.put("/checklists/:id", requireRole(["instituto", "admin", "paciente"]), checklistController.atualizarChecklist);
router.delete("/checklists/:id", requireRole(["instituto", "admin", "paciente"]), checklistController.deletarChecklist);

router.put("/pacientes/:id/foto-perfil", requireRole(["instituto", "admin", "paciente", "medico"]), patientController.atualizarFotoPerfil);

// ── Consultas (Anotações) ──
import * as consultasController from "../controllers/consultasController";
router.post("/consultas/:idPaciente", requireRole(["medico", "instituto", "admin"]), consultasController.adicionarNota);
router.get("/consultas/paciente/:idPaciente", requireRole(["medico", "instituto", "paciente", "admin"]), consultasController.listarNotasPaciente);
router.put("/consultas/:id", requireRole(["medico", "instituto", "admin"]), consultasController.atualizarNota);
router.delete("/consultas/:id", requireRole(["medico", "instituto", "admin"]), consultasController.deletarNota);

// ── Notificações PCR ──
router.get("/notificacoes-pcr", requireRole(["instituto", "admin"]), notificacaoController.getNotificacoesPCR);
router.get("/notificacoes-pcr/count", requireRole(["instituto", "admin"]), notificacaoController.getNotificacoesPCRCount);
router.patch("/notificacoes-pcr/:id/lida", requireRole(["instituto", "admin"]), notificacaoController.marcarNotificacaoLida);

export default router;
