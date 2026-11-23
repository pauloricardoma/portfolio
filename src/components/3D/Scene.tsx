/**
 * Scene.tsx — Canvas da cena 3D com estúdio, pós e medição de FPS.
 *
 * O <Canvas> do React Three Fiber cria cena, câmera, renderer e o loop.
 * Aqui ficam as partes que não dependem do conteúdo:
 * - StudioLights: ambiente de Lightformers + key light, por tema.
 * - SceneEffects: bloom + MSAA (lazy, só desktop).
 * - PerformanceMonitor: mede o FPS e avisa o useSceneQuality (de quem usa
 *   a cena) para descer/subir a qualidade quando a GPU não dá conta.
 *
 * Fundo transparente (alpha): o palco em CSS aparece por trás.
 */
import { lazy, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { ThemeMode } from "~/styles/tokens";
import { CAMERA_FOV, CAMERA_POSITION, CAMERA_TARGET, FPS_MIN, FPS_RECOVER, FPS_SAMPLES, FPS_SAMPLE_MS } from "./config";
import StudioLights from "./StudioLights";
import type { SceneQuality } from "./useSceneQuality";

const SceneEffects = lazy(() => import("./SceneEffects"));

interface SceneProps {
  children: ReactNode;
  className?: string;
  themeMode: ThemeMode;
  quality: SceneQuality;
}

export default function Scene({ children, className, themeMode, quality }: SceneProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_TARGET)}
      dpr={quality.dpr}
      /** Sem antialias nativo: o EffectComposer faz MSAA quando ligado */
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {quality.monitoring && (
        <PerformanceMonitor
          ms={FPS_SAMPLE_MS}
          iterations={FPS_SAMPLES}
          bounds={() => [FPS_MIN, FPS_RECOVER]}
          onDecline={quality.decline}
          onIncline={quality.incline}
        />
      )}

      <StudioLights themeMode={themeMode} />

      {children}

      {quality.effects && (
        <Suspense fallback={null}>
          <SceneEffects />
        </Suspense>
      )}
    </Canvas>
  );
}
