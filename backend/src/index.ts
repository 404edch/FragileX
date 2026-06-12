import express from "express";
import cors from "cors";
import apiRotas from "./routes/apiRotas";

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', apiRotas);

app.listen(3000, () => { console.log("Servidor rodando na porta 3000"); });