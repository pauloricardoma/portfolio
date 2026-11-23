import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { roundedPlane } from "./geometry";

interface DeviceScreenProps {
  texture: string;
  width: number;
  height: number;
  radius: number;
  position?: [number, number, number];
}

/**
 * Tela do aparelho. A screenshot entra como emissivo (não escurece com a luz
 * nem com o tema) e a superfície é um vidro liso: o ambiente de estúdio
 * desenha um reflexo sutil por cima, mais forte nos ângulos rasantes.
 * toneMapped=false mantém as cores da screenshot e deixa a tela abaixo do
 * limiar do bloom.
 */
export default function DeviceScreen({ texture, width, height, radius, position }: DeviceScreenProps) {
  const map = useTexture(texture);
  const geometry = useMemo(() => roundedPlane(width, height, radius), [width, height, radius]);

  return (
    <mesh geometry={geometry} position={position}>
      <meshStandardMaterial
        color="#000000"
        emissive="#ffffff"
        emissiveMap={map}
        emissiveIntensity={1}
        roughness={0.12}
        metalness={0}
        toneMapped={false}
      />
    </mesh>
  );
}
