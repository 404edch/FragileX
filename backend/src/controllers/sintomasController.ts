import { Request, Response } from "express";
import { getSintomas } from "../services/getSintomas";

export const sendSintomas = (req: Request, res: Response) => {
    getSintomas().then(sintomas => {
      res.json(sintomas);
      return res
    }).catch(error => {
        console.error("Error sending sintomas:", error);
        res.status(500).json({ error: "Failed to fetch sintomas" });
    });
}

