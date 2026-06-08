import React, { useRef } from 'react';
import { DADOS_CARDS } from '../constants/constantes';
import { useLarguraJanela, useUmaVezNoViewport } from '../hooks/useHooks';
import { CarrosselDesktop, CarrosselMobile } from './Carrossel';
import AnimatedContent from './AnimatedContent';

const QuemSomos = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 768;

  const secaoRef = useRef(null);
  const cabecalhoVisto = useUmaVezNoViewport(secaoRef, 0.2);

  return (
    <section
      ref={secaoRef}
      aria-labelledby="quem-somos-titulo"
      style={{
        background: "linear-gradient(180deg, #eaf3fb 0%, #ffffff 100%)",
        padding: "56px clamp(16px, 3vw, 24px) 64px",
        textAlign: "center",
      }}
    >
      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15}>
        <header
          className={cabecalhoVisto ? "anim-subir" : ""}
          style={{
            marginBottom: 40,
            opacity: cabecalhoVisto ? undefined : 0,
          }}
        >
          <h2
            id="quem-somos-titulo"
            style={{
              fontSize: "clamp(17px, 2.5vw, 22px)",
              fontWeight: 700,
              color: "#1a3a6e",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            QUEM SOMOS NÓS
          </h2>
          <p style={{
            fontSize: 13,
            color: "#5a7a9a",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto",
          }}>
            Conheça a equipe, nossa missão e o impacto que geramos juntos.
          </p>
        </header>
      </AnimatedContent>

      <AnimatedContent distance={40} direction="vertical" duration={1} initialOpacity={0} animateOpacity threshold={0.15} delay={0.2}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          width: "100%",
        }}>
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
