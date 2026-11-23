import { useEffect, useState } from "react";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Diz se o navegador consegue criar um contexto WebGL.
 * `null` no SSR e antes de montar (ainda não sabemos).
 */
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}
