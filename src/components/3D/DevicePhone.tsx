/**
 * DevicePhone.tsx — Celular modelado em código.
 *
 * Corpo: retângulo arredondado extrudado com chanfro (geometry.ts). A
 * ExtrudeGeometry tem dois grupos de material: 0 = frente/trás (vidro
 * fosco traseiro) e 1 = laterais (aro de metal polido), por isso dois
 * materiais com attach="material-0|1".
 *
 * Frente: vidro preto, tela inset com cantos arredondados e a ilha.
 * Trás: módulo de câmera elevado com três lentes e flash.
 * Laterais: botões de volume, ação e power.
 */
import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { BEZEL, type DevicePalette } from "./config";
import { chamferedSlab, roundedPlane } from "./geometry";
import DeviceScreen from "./DeviceScreen";

interface DevicePhoneProps {
  screenTexture: string;
  palette: DevicePalette;
  scale?: number;
}

const WIDTH = 1.0;
const HEIGHT = 2.1;
const DEPTH = 0.1;
const CORNER = 0.15;
const FRONT_Z = DEPTH / 2;
const BACK_Z = -DEPTH / 2;

/** Lentes da câmera traseira, relativas ao módulo */
const LENSES: [number, number][] = [
  [-0.085, 0.085],
  [-0.085, -0.085],
  [0.085, 0],
];

export default function DevicePhone({ screenTexture, palette, scale = 1.1 }: DevicePhoneProps) {
  const body = useMemo(() => chamferedSlab(WIDTH, HEIGHT, DEPTH, CORNER, 0.018), []);
  const glass = useMemo(() => roundedPlane(WIDTH - 0.03, HEIGHT - 0.03, CORNER - 0.015), []);
  const island = useMemo(() => roundedPlane(0.27, 0.078, 0.039), []);
  const cameraPlate = useMemo(() => chamferedSlab(0.42, 0.42, 0.03, 0.1, 0.008), []);

  return (
    <group scale={scale}>
      {/* Corpo: traseira de vidro fosco + aro polido */}
      <mesh geometry={body}>
        <meshPhysicalMaterial
          attach="material-0"
          color={palette.body}
          metalness={0.2}
          roughness={0.5}
          clearcoat={0.6}
          clearcoatRoughness={0.35}
        />
        <meshPhysicalMaterial attach="material-1" color={palette.frame} metalness={1} roughness={0.22} />
      </mesh>

      {/* Frente: vidro preto, tela e ilha */}
      <mesh geometry={glass} position={[0, 0, FRONT_Z + 0.001]}>
        <meshPhysicalMaterial color={BEZEL} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <DeviceScreen
        texture={screenTexture}
        width={WIDTH - 0.1}
        height={HEIGHT - 0.1}
        radius={CORNER - 0.04}
        position={[0, 0, FRONT_Z + 0.002]}
      />
      <mesh geometry={island} position={[0, HEIGHT / 2 - 0.12, FRONT_Z + 0.003]}>
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Botões: ação e volume à esquerda, power à direita */}
      {[
        { x: -WIDTH / 2 - 0.006, y: 0.62, h: 0.1 },
        { x: -WIDTH / 2 - 0.006, y: 0.42, h: 0.18 },
        { x: -WIDTH / 2 - 0.006, y: 0.18, h: 0.18 },
        { x: WIDTH / 2 + 0.006, y: 0.36, h: 0.28 },
      ].map((button) => (
        <RoundedBox
          key={`${button.x}-${button.y}`}
          args={[0.018, button.h, 0.045]}
          radius={0.008}
          smoothness={2}
          position={[button.x, button.y, 0]}
        >
          <meshPhysicalMaterial color={palette.frame} metalness={1} roughness={0.25} />
        </RoundedBox>
      ))}

      {/* Módulo de câmera traseiro */}
      <group position={[-0.2, HEIGHT / 2 - 0.32, BACK_Z - 0.01]}>
        <mesh geometry={cameraPlate}>
          <meshPhysicalMaterial
            attach="material-0"
            color={palette.body}
            metalness={0.3}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
          <meshPhysicalMaterial attach="material-1" color={palette.frame} metalness={1} roughness={0.22} />
        </mesh>

        {LENSES.map(([x, y]) => (
          <group key={`${x}-${y}`} position={[x, y, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Anel de metal */}
            <mesh>
              <cylinderGeometry args={[0.072, 0.072, 0.02, 32]} />
              <meshPhysicalMaterial color={palette.frame} metalness={1} roughness={0.2} />
            </mesh>
            {/* Vidro da lente */}
            <mesh position={[0, -0.011, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.004, 32]} />
              <meshPhysicalMaterial color="#05060A" roughness={0.04} clearcoat={1} metalness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Flash */}
        <mesh position={[0.085, 0.13, -0.016]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.026, 24]} />
          <meshStandardMaterial color="#F2E6C8" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
