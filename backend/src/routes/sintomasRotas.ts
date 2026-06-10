import { Router, Request, Response } from 'express';
import { sendSintomas } from '../controllers/sintomasController';

const sintomaRotas = Router();

sintomaRotas.get('/', sendSintomas)

export default sintomaRotas;