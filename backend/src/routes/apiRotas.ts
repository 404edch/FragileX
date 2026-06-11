import { Router } from "express";
import * as userController from "../controllers/userController";
import * as patientController from "../controllers/patientController";
import * as linkController from "../controllers/linkController";
import * as doctorController from "../controllers/doctorController";
import * as landingController from "../controllers/landingController";
import * as auditController from "../controllers/auditController";
import * as checklistController from "../controllers/checklistController";

const router = Router();

// Auth & Users
router.post("/auth/login", userController.login);
router.get("/users/:id", userController.getMe);
router.get("/users", userController.listAll);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.remove);

// Patients
router.post("/patients/cadastrar-pelo-medico", patientController.cadastrarPeloMedico);
router.get("/patients/validar-token", patientController.validarTokenAtivacao);
router.post("/patients/ativar-conta", patientController.ativarConta);
router.post("/patients/autocadastro", patientController.autocadastro);
router.get("/patients/:id", patientController.getPaciente);
router.get("/patients/medico/:idMedico", patientController.listPacientesDoMedico);
router.get("/patients", patientController.listTodosPacientes);

// Links (Vínculos)
router.post("/links/solicitar", linkController.solicitarVinculo);
router.get("/links/paciente/:idPaciente", linkController.listarSolicitacoesVinculoPaciente);
router.post("/links/:id/responder", linkController.responderSolicitacaoVinculo);

// Doctors (Credenciamento)
router.get("/doctors/:id", doctorController.getMedico);
router.post("/doctors/solicitar", doctorController.solicitarCredenciamento);
router.get("/doctors/solicitacoes", doctorController.listarSolicitacoesCredenciamento);
router.post("/doctors/solicitacoes/:id/responder", doctorController.responderSolicitacaoCredenciamento);
router.post("/doctors/registrar-direto", doctorController.registrarMedicoDireto);

// Landing Editables
router.get("/landing/cards", landingController.getCards);
router.post("/landing/cards", landingController.saveCards);
router.get("/landing/news", landingController.getNews);
router.post("/landing/news", landingController.saveNews);

// Audit
router.get("/audits", auditController.getAudits);

// Checklists
router.post("/checklists", checklistController.salvarChecklist);
router.get("/checklists/paciente/:idPaciente", checklistController.obterChecklistsPaciente);

export default router;
