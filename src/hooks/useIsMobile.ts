import { useState, useEffect } from "react";
import { breakpoints } from "~/styles/tokens";

/**
 * useIsMobile — Detecta se a tela é menor que o breakpoint tablet.
 *
 * Usa window.matchMedia (mais performático que resize listener).
 * Retorna false no SSR (window não existe no servidor).
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.tablet - 1}px)`);
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}