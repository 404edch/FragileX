import { db } from "../config/database";
import { Sintoma} from "../../../shared/classes/sintoma";

export const getSintomas = async () => {
    try {
        const query = 'SELECT id, sintoma, score_m, score_f FROM sintomas';
        const resultado = await db.query(query);
        const sintomas: Sintoma[] = [];
        for (const row of resultado.rows) {
            const {id, sintoma, score_m, score_f} = row;
            sintomas.push(new Sintoma(id, sintoma, score_m, score_f));
        }
        return sintomas;
    } catch (error) {
        console.error('Error fetching sintomas:', error);
        throw error;
    }
};