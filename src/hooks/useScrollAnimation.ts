import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  start?: string;
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
