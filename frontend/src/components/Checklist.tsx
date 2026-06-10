import React, { use, useState } from "react";
import { Sintoma } from "../../../shared/classes/sintoma";
import { getSintomas } from "../services/getSintomas";

const promiseSintomas = getSintomas();
console.log(promiseSintomas);

const Checklist = () => {
  const sintomas = use(promiseSintomas);
  const [selecionados, setSelecionados] = useState(new Set<number>());

  const handleSelecao = (idSintoma: number) => {
    const novosSelecionados = new Set(selecionados);
    if (novosSelecionados.has(idSintoma)) novosSelecionados.delete(idSintoma);
    else novosSelecionados.add(idSintoma);

    setSelecionados(novosSelecionados);
  };

  return (
    <div>
      {sintomas.map((sintoma, index) => (
        <>
          <label key={"label" + " " + sintoma.id}>{sintoma.nome}</label>
          <input
            key={"input" + " " + sintoma.id}
            type="checkbox"
            checked={selecionados.has(sintoma.id)}
            onChange={() => handleSelecao(sintoma.id)}
          ></input>
        </>
      ))}
    </div>
  );
};

export default Checklist;
