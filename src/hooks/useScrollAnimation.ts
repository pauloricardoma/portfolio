/**
 * useScrollAnimation.ts — Hook reutilizável para animações de scroll com GSAP.
 *
 * CONCEITOS GSAP:
 *
 * 1. gsap.from(elemento, config) — Anima DE um estado inicial PARA o estado
 *    atual do CSS. Ex: gsap.from(el, { opacity: 0 }) faz o elemento começar
 *    invisível e aparecer gradualmente.
 *
 * 2. ScrollTrigger — Plugin que vincula animações ao scroll:
 *    - trigger: elemento que "ativa" a animação quando entra na viewport
 *    - start: "top 80%" = ativa quando o TOPO do trigger chega a 80% da viewport
 *    - toggleActions: define o que acontece em 4 momentos:
 *      "play none none none" = play ao entrar, nada nos outros
 *
 * 3. useGSAP — Hook oficial do @gsap/react que faz cleanup automático.
 *    Quando o componente desmonta, todas as animações e ScrollTriggers
 *    criados dentro dele são destruídos automaticamente (evita memory leaks).
 *
 * Este hook encapsula o padrão mais comum: "animar entrada de um elemento
 * quando ele aparece no scroll".
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Registra o plugin ScrollTrigger — OBRIGATÓRIO antes de usar */
gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  /** De onde o elemento vem (default: baixo pra cima) */
  y?: number;
  x?: number;
  /** Opacidade inicial (default: 0 = invisível) */
  opacity?: number;
  /** Duração em segundos (default: 0.8) */
  duration?: number;
  /** Quando ativa: "top 80%" = topo do elemento a 80% da viewport */
  start?: string;
  /** Delay em segundos antes de começar */
  delay?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    duration = 0.8,
    start = "top 85%",
    delay = 0,
  } = options;

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      y,
      x,
      opacity,
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: "play none none none",
      },
    });
  }, []);

  return ref;
}
