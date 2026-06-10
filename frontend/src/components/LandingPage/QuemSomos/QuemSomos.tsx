import React, { useRef } from 'react';
import { DADOS_CARDS } from '../../../constants/constantes';
import { useLarguraJanela, useUmaVezNoViewport } from '../../../hooks/useHooks';
import { CarrosselDesktop, CarrosselMobile } from '../Carrossel/Carrossel';
import AnimatedContent from '../../Shared/AnimatedContent';
import './QuemSomos.css';

const QuemSomos = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 768;

  const secaoRef = useRef(null);
  const cabecalhoVisto = useUmaVezNoViewport(secaoRef, 0.2);

  return (
    <section
      ref={secaoRef}
      aria-labelledby="quem-somos-titulo"
      className="quem-somos-section"
    >
      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15}>
        <header
          className={`quem-somos-header ${cabecalhoVisto ? "anim-subir" : ""}`}
          style={{ opacity: cabecalhoVisto ? undefined : 0 }}
        >
          <h2 id="quem-somos-titulo" className="quem-somos-title">
            QUEM SOMOS NÓS
          </h2>
          <p className="quem-somos-subtitle">
            Conheça a equipe, nossa missão e o impacto que geramos juntos.
          </p>
        </header>
      </AnimatedContent>

      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15} delay={0.2}>
        <div className="quem-somos-carousel-wrapper">
          {ehMobile
            ? <CarrosselMobile cards={DADOS_CARDS} />
            : <CarrosselDesktop cards={DADOS_CARDS} />
          }
        </div>
      </AnimatedContent>
    </section>
  );
};

export default QuemSomos;
