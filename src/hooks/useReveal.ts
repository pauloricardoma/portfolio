import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Anima com fade + slide up cada elemento ".reveal" dentro do container
 * quando ele entra na viewport. Os elementos começam com visibility: hidden
 * (global.ts), por isso fromTo com autoAlpha explícito.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray<HTMLElement>(".reveal", ref.current);
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: ref }
  );

  return ref;
}
