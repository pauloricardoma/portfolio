import { useCallback, useEffect, useState } from "react";
import { DPR_MAX, MAX_QUALITY_SWITCHES, QUALITY_LEVELS } from "./config";

export type SceneQuality = ReturnType<typeof useSceneQuality>;

/**
 * Qualidade da cena por nível (spec 0007, degradação):
 * 0 tudo · 1 sem pós-processamento · 2 sem sombra de contato · 3 DPR 1.
 *
 * Ponteiro grosso (celular) já começa no nível 1 e nunca liga o pós.
 * O PerformanceMonitor chama `decline`/`incline`; depois de
 * MAX_QUALITY_SWITCHES trocas, o nível congela (`settled`).
 */
export function useSceneQuality() {
  const [finePointer, setFinePointer] = useState(false);
  const [level, setLevel] = useState(1);
  const [switches, setSwitches] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setFinePointer(fine);
    setLevel(fine ? 0 : 1);

    // Aba oculta: para de medir, senão a volta conta como queda de FPS
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const minLevel = finePointer ? 0 : 1;

  const decline = useCallback(() => {
    if (level >= QUALITY_LEVELS) return;
    setLevel(level + 1);
    setSwitches((n) => n + 1);
  }, [level]);

  const incline = useCallback(() => {
    if (level <= minLevel) return;
    setLevel(level - 1);
    setSwitches((n) => n + 1);
  }, [level, minLevel]);

  const pointer = finePointer ? "fine" : "coarse";

  return {
    level,
    effects: finePointer && level < 1,
    shadows: level < 2,
    dpr: (level >= 3 ? 1 : [1, DPR_MAX[pointer]]) as number | [number, number],
    /** Medir FPS só com a aba visível e enquanto ainda pode trocar de nível */
    monitoring: visible && switches < MAX_QUALITY_SWITCHES,
    decline,
    incline,
  };
}
