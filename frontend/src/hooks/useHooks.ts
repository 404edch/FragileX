import { useState, useEffect, RefObject } from "react";

/**
 * Retorna a largura atual da janela, atualiza no redimensionamento (com debounce).
 */
export function useLarguraJanela(): number {
  const [largura, setLargura] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tratarRedimensionamento = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setLargura(window.innerWidth), 80);
    };
    window.addEventListener("resize", tratarRedimensionamento, { passive: true });
    return () => {
      window.removeEventListener("resize", tratarRedimensionamento);
      clearTimeout(timer);
    };
  }, []);

  return largura;
}

/**
 * Dispara o callback uma vez quando o elemento entra no viewport pela primeira vez.
 */
export function useUmaVezNoViewport(ref: RefObject<HTMLElement | null>, limite: number = 0.2): boolean {
  const [disparado, setDisparado] = useState<boolean>(false);

  useEffect(() => {
    if (disparado) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) setDisparado(true);
      },
      { threshold: limite }
    );
    const el = ref.current;
    if (el) observador.observe(el);
    return () => {
      if (el) observador.unobserve(el);
    };
  }, [ref, limite, disparado]);

  return disparado;
}
