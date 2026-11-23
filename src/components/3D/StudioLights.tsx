/**
 * StudioLights.tsx — Luz de estúdio montada em código.
 *
 * O <Environment> do drei aqui NÃO usa `preset` nem `files` (que baixariam
 * um HDR de CDN): ele renderiza uma vez (frames=1) um cubo com os
 * Lightformers abaixo, que viram reflexo e luz ambiente (IBL) nos metais.
 * Uma tira laranja de fundo dá o brilho de borda na cor da marca.
 */
import { Environment, Lightformer } from "@react-three/drei";
import { accent, type ThemeMode } from "~/styles/tokens";
import { LIGHTS } from "./config";

const ORIGIN: [number, number, number] = [0, 0, 0];

export default function StudioLights({ themeMode }: { themeMode: ThemeMode }) {
  const rig = LIGHTS[themeMode];

  return (
    <>
      {/* key: troca de tema remonta o ambiente (frames=1 não re-renderiza sozinho) */}
      <Environment key={themeMode} resolution={256} frames={1} environmentIntensity={rig.environment}>
        {/* Softbox de cima */}
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 0]} scale={[10, 4, 1]} target={ORIGIN} />
        {/* Tiras laterais: desenham o reflexo comprido no metal */}
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} scale={[6, 1.2, 1]} target={ORIGIN} />
        <Lightformer form="rect" intensity={1.4} position={[5, 1, 2]} scale={[6, 1.2, 1]} target={ORIGIN} />
        {/* Preenchimento frontal fraco */}
        <Lightformer form="rect" intensity={0.6} position={[0, 0, 8]} scale={[8, 4, 1]} target={ORIGIN} />
        {/* Borda laranja da marca, atrás */}
        <Lightformer form="rect" color={accent} intensity={1.2} position={[-3, 2, -5]} scale={[4, 0.4, 1]} target={ORIGIN} />
      </Environment>

      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 5]} intensity={rig.key} />
    </>
  );
}
