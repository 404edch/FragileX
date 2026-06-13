import { PoolClient } from "pg";

export interface ScoreCalculationResult {
  scoreCalculado: number;
  memoriaCalculo: string;
  classificacao: string;
  sintomasEncontrados: any[];
}

export const calculateChecklistScore = async (
  client: PoolClient | any,
  sintomasSelecionados: number[],
  sexo_biologico: string
): Promise<ScoreCalculationResult> => {
  let scoreCalculado = 0;
  let memoriaCalculo = '';
  let classificacao = 'Negativo';
  let sintomasEncontrados: any[] = [];

  if (sintomasSelecionados.length > 0) {
    const sintomasRes = await client.query(
      `SELECT id, sintoma, score_m, score_f FROM sintomas WHERE id = ANY($1::int[])`,
      [sintomasSelecionados]
    );
    sintomasEncontrados = sintomasRes.rows;

    const calculos: string[] = [];
    for (const s of sintomasEncontrados) {
      const peso = sexo_biologico === 'M' ? Number(s.score_m) : Number(s.score_f);
      scoreCalculado += peso;
      calculos.push(`${s.sintoma}: ${peso.toFixed(2)}`);
    }
    memoriaCalculo = calculos.join('\n');
  }

  if (sexo_biologico === 'M' && scoreCalculado >= 0.56) classificacao = 'Suspeito';
  if (sexo_biologico === 'F' && scoreCalculado >= 0.55) classificacao = 'Suspeito';

  return {
    scoreCalculado,
    memoriaCalculo,
    classificacao,
    sintomasEncontrados
  };
};

export const mapSymptomsToChecklists = (symptomsRows: any[]) => {
  const symptomsMap: Record<number, number[]> = {};
  const symptomsNamesMap: Record<number, string[]> = {};
  
  symptomsRows.forEach(row => {
    if (!symptomsMap[row.id_checklist]) {
      symptomsMap[row.id_checklist] = [];
      symptomsNamesMap[row.id_checklist] = [];
    }
    symptomsMap[row.id_checklist].push(row.id_sintoma);
    symptomsNamesMap[row.id_checklist].push(row.nome_sintoma);
  });

  return { symptomsMap, symptomsNamesMap };
};
