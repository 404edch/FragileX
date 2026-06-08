import React, { useRef, useEffect } from 'react';
import { ALTURA_NAVBAR } from '../constants/constantes';
import { useLarguraJanela } from '../hooks/useHooks';
import AnimatedContent from './AnimatedContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const larguraJanela = useLarguraJanela();
  const ehMobile = larguraJanela < 480;
  const mascotRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
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
      aria-label="Bem-vindo ao Instituto Buko Kaesemodel"
      style={{
        marginTop: ALTURA_NAVBAR,
        background: "linear-gradient(160deg, #0d2e5e 0%, #1a5fa8 45%, #4a9fd4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px clamp(20px, 5vw, 60px)",
        position: "relative",
        overflow: "hidden",
        minHeight: 500,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 18,
          width: "100%",
          maxWidth: ehMobile ? 320 : 400,
        }}
      >
        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.08}>
          <button
            style={{
              background: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "16px 32px",
              fontSize: 16,
              fontWeight: 700,
              color: "#1a3a6e",
              boxShadow: "0 4px 20px rgba(0,0,0,0.16)",
              letterSpacing: 0.4,
              width: 220,
              whiteSpace: "nowrap",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.16)";
            }}
          >
            Cadastre-se
          </button>
        </AnimatedContent>

        <AnimatedContent distance={30} direction="vertical" duration={0.9} initialOpacity={0} animateOpacity scale={1.02} delay={0.22}>
          <button
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.85)",
              borderRadius: 8,
              padding: "16px 32px",
              fontSize: 16,
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: 0.4,
              width: 220,
              whiteSpace: "nowrap",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.85)";
            }}
          >
            Sou um Médico
          </button>
        </AnimatedContent>

        <div
          aria-label="Seção de notícias"
          style={{
            flex: 'none',
            minHeight: 120,
            borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.65)",
            background: "rgba(255,255,255,0.08)",
            width: "100%",
          }}
        />
      </div>

      {!ehMobile && (
        <AnimatedContent distance={60} direction="horizontal" duration={0.9} initialOpacity={1} animateOpacity={false} scale={1.02} delay={0.3}>
          <div
            ref={mascotRef}
            style={{
              position: "absolute",
              right: "-370px",
              bottom: "-270px",
              width: 280,
              height: 340,
              borderRadius: 12,
              overflow: "hidden",
              transform: "rotate(-8deg)",
              flexShrink: 0,
            }}
          >
            <img
              src="/buko.png"
              alt="Buko mascot waving"
              style={{
                width: "130%",
                height: "80%",
                objectFit: "cover",
                objectPosition: "center 20%",
              }}
            />
          </div>
        </AnimatedContent>
      )}
    </section>
  );
};

export default Hero;