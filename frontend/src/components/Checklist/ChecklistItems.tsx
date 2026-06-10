import React, { use, useState, useEffect } from "react";
import { Sintoma } from "../../../../shared/classes/sintoma";

interface Props {
  promiseSintomas: Promise<Sintoma[]>;

  onChange: (selecionados: number[]) => void;
}

export default function ChecklistItems({ promiseSintomas, onChange }: Props) {
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const sintomas: Sintoma[] = use(promiseSintomas);

  useEffect(() => {
    onChange(selecionados);
  }, [selecionados, onChange]);

  const handleSelecao = (idSintoma: number) => {
    setSelecionados((oldSelecionados) =>
      oldSelecionados.includes(idSintoma) ? oldSelecionados.filter((id) => id !== idSintoma) : [...oldSelecionados, idSintoma],
    );
  };

  return (
    <>
      <div className="checklist-items-grid">
        {sintomas.map((sintoma) => (
          <div key={sintoma.id}>
            <input
              id={`sintoma-${sintoma.id}`}
              className="checklist-item-input"
              type="checkbox"
              checked={selecionados.includes(sintoma.id)}
              onChange={() => handleSelecao(sintoma.id)}
            />
            <label
              htmlFor={`sintoma-${sintoma.id}`}
              className="checklist-item-label"
            >
              {sintoma.nome}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
