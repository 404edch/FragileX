import { criarUsuario } from "./services/criarUsuario";
import { logarUsuario } from "./services/logarUsuario";
import { verificarEmail } from "./services/verificarEmail";
import express from "express";
import cors from "cors";
import sintomaRotas from "./routes/sintomasRotas";
import apiRotas from "./routes/apiRotas";

const app = express();
app.use(cors());

app.use(express.json());

app.use('/sintomas', sintomaRotas);
app.use('/api', apiRotas);

app.listen(3000, () => {console.log("Rodando")});