import React, { useRef, useEffect } from 'react';
import { ALTURA_NAVBAR } from '../../../constants/constantes';
import { useLarguraJanela } from '../../../hooks/useHooks';
import AnimatedContent from '../../Shared/AnimatedContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const ehDispositivoTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

const Hero = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 480;
  const mascotRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (ehDispositivoTouch()) return;

    if (mascotRef.current && sectionRef.current) {
      gsap.to(mascotRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom center",
          scrub: 0.5,
          markers: false,
        },
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-label="Bem-vindo ao Instituto Buko Kaesemodel"
      style={{ marginTop: ALTURA_NAVBAR }}
    >
      <div className="hero-content" style={{ maxWidth: ehMobile ? 320 : 400 }}>
        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.08}>
          <button className="hero-btn-primary">
            Cadastre-se
          </button>
        </AnimatedContent>

        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.22}>
          <button className="hero-btn-secondary">
            Sou um Médico
          </button>
        </AnimatedContent>

        <div aria-label="Seção de notícias" className="hero-news-placeholder" />
      </div>

      {/* Mascote Buko - Responsivo */}
      <AnimatedContent distance={60} direction="horizontal" duration={0.9} initialOpacity={1} animateOpacity={false} scale={1.02} delay={0.3}>
        <div
          ref={mascotRef}
          className="hero-mascot-container"
          style={{
            right: ehMobile ? "-120px" : "-370px",
            bottom: ehMobile ? "-210px" : "-270px",
            transform: ehMobile ? "translateX(50%) rotate(-8deg)" : "rotate(-8deg)",
            width: ehMobile ? 200 : 280,
            height: ehMobile ? 240 : 340,
            opacity: ehMobile ? 1 : 1,
          }}
        >
          <img src="/buko.png" alt="Mascote Buko acenando" className="hero-mascot-img" />
        </div>
      </AnimatedContent>
    </section>
  );
};

export default Hero;
