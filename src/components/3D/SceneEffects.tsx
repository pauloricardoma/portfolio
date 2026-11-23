/**
 * SceneEffects.tsx — Pós-processamento (só desktop; chunk lazy próprio).
 *
 * Bloom só acima de BLOOM.threshold: o LED da câmera e reflexos fortes do
 * metal. A tela fica em no máximo 1 (toneMapped=false) e não brilha.
 * MSAA (multisampling) compensa o antialias desligado no renderer.
 *
 * Sem profundidade de campo: o DepthOfField do postprocessing apaga o
 * alpha do canvas e o palco ficava preto (plano 06, desvio).
 */
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BLOOM } from "./config";

export default function SceneEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        luminanceThreshold={BLOOM.threshold}
        luminanceSmoothing={0.1}
        intensity={BLOOM.intensity}
        radius={BLOOM.radius}
      />
    </EffectComposer>
  );
}
