/**
 * FloorShadow.tsx — Sombra de contato suave no piso, sob cada aparelho.
 *
 * Um plano com gradiente radial (gerado uma vez num <canvas>), em vez do
 * ContactShadows do drei: aquele renderiza a cena de novo a cada frame e,
 * junto com o EffectComposer, virava um plano cinza opaco (plano 06, desvio).
 */
import { forwardRef, useMemo } from "react";
import { CanvasTexture, type Mesh } from "three";

let sharedTexture: CanvasTexture | null = null;

/**
 * Gradiente radial branco → preto, compartilhado por todas as sombras.
 * Vai no alphaMap, que lê o canal verde: branco = sombra, preto = nada.
 */
function shadowTexture() {
  if (sharedTexture) return sharedTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.45, "#8c8c8c");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  sharedTexture = new CanvasTexture(canvas);
  return sharedTexture;
}

interface FloorShadowProps {
  /** Largura e profundidade da mancha */
  size: [number, number];
  opacity: number;
}

const FloorShadow = forwardRef<Mesh, FloorShadowProps>(function FloorShadow({ size, opacity }, ref) {
  const texture = useMemo(shadowTexture, []);

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="#000000" alphaMap={texture} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
});

export default FloorShadow;
