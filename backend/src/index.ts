import express from "express";
import cors from "cors";
import sintomaRotas from "./routes/sintomasRotas";
import apiRotas from "./routes/apiRotas";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/sintomas', sintomaRotas);
app.use('/api', apiRotas);

app.listen(3000, () => { console.log("Servidor rodando na porta 3000"); });