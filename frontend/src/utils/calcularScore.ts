import type { Sintoma } from "../../../shared/classes/sintoma";

interface Resultado {
    score: number;
    resultadoPositivo: boolean;
}

const LIMIAR_MASCULINO = 0.56;
const LIMIAR_FEMININO = 0.55;





export const calcularScore = (sintomas: Sintoma[], sexo: "M" | "F") : Resultado => {
    let score = 0;

    for (const sintoma of sintomas) {
        if (sintoma.possui) {
            score += sexo === "M" ? sintoma.peso_M : sintoma.peso_F;
        }
    }

    if (sexo === "M") {
        return {
            score,
            resultadoPositivo: score >= LIMIAR_MASCULINO
        };
    } else {
        return {
            score,
            resultadoPositivo: score >= LIMIAR_FEMININO
        };
    }



}
    