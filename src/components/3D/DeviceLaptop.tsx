/**
 * DeviceLaptop.tsx — Notebook modelado em código.
 *
 * Base: bloco de alumínio com chanfro deitado no plano xz (topo em y = 0),
 * poço do teclado, teclas instanciadas e trackpad.
 *
 * Tampa: presa num grupo de DOBRADIÇA na borda de trás. Girar esse grupo
 * em x abre e fecha a tampa (LID_CLOSED → LID_OPEN); o `hingeRef` deixa
 * quem está de fora animar sem re-render (entrada do plano 07).
 */
import { useMemo, type Ref } from "react";
import type { Group } from "three";
import { BEZEL, LED_COLOR, LED_INTENSITY, LID_OPEN, type DevicePalette } from "./config";
import { chamferedSlab, roundedPlane } from "./geometry";
import DeviceScreen from "./DeviceScreen";
import LaptopKeyboard, { keyboardDepth } from "./LaptopKeyboard";

interface DeviceLaptopProps {
  screenTexture: string;
  palette: DevicePalette;
  scale?: number;
  /** Ângulo inicial da dobradiça (radianos) */
  lidAngle?: number;
  hingeRef?: Ref<Group>;
}

const WIDTH = 2.3;
const BASE_DEPTH = 1.55;
const BASE_THICKNESS = 0.07;
const LID_HEIGHT = 1.5;
const LID_THICKNESS = 0.04;
const CORNER = 0.08;

const KEYBOARD_WIDTH = WIDTH - 0.42;
const KEYBOARD_DEPTH = keyboardDepth(KEYBOARD_WIDTH);
/** Centro do teclado em z: perto da dobradiça, como num notebook real */
const KEYBOARD_Z = -BASE_DEPTH / 2 + 0.14 + KEYBOARD_DEPTH / 2;
const TRACKPAD = { width: 0.95, depth: 0.52 };
const TRACKPAD_Z = BASE_DEPTH / 2 - 0.1 - TRACKPAD.depth / 2;

/** Superfícies deitadas no plano xz (planos nascem no xy) */
const FLAT: [number, number, number] = [-Math.PI / 2, 0, 0];

export default function DeviceLaptop({
  screenTexture,
  palette,
  scale = 1,
  lidAngle = LID_OPEN,
  hingeRef,
}: DeviceLaptopProps) {
  const base = useMemo(() => chamferedSlab(WIDTH, BASE_DEPTH, BASE_THICKNESS, CORNER, 0.012), []);
  const lid = useMemo(() => chamferedSlab(WIDTH, LID_HEIGHT, LID_THICKNESS, CORNER, 0.01), []);
  const deck = useMemo(() => roundedPlane(KEYBOARD_WIDTH + 0.06, KEYBOARD_DEPTH + 0.06, 0.03), []);
  const trackpad = useMemo(() => roundedPlane(TRACKPAD.width, TRACKPAD.depth, 0.05), []);
  const bezel = useMemo(() => roundedPlane(WIDTH - 0.025, LID_HEIGHT - 0.025, CORNER - 0.01), []);

  return (
    /* Desce o conjunto para o centro visual ficar perto da origem do carrossel */
    <group scale={scale} position={[0, -1.0, -0.45]}>
      {/* Base */}
      <mesh geometry={base} rotation={FLAT} position={[0, -BASE_THICKNESS / 2, 0]}>
        <meshPhysicalMaterial attach="material-0" color={palette.body} metalness={0.6} roughness={0.42} />
        <meshPhysicalMaterial attach="material-1" color={palette.frame} metalness={1} roughness={0.25} />
      </mesh>

      {/* Poço do teclado + teclas */}
      <mesh geometry={deck} rotation={FLAT} position={[0, 0.001, KEYBOARD_Z]}>
        <meshStandardMaterial color={palette.deck} metalness={0.6} roughness={0.5} />
      </mesh>
      <group position={[0, 0.001, KEYBOARD_Z]}>
        <LaptopKeyboard color={palette.keys} width={KEYBOARD_WIDTH} />
      </group>

      {/* Trackpad de vidro */}
      <mesh geometry={trackpad} rotation={FLAT} position={[0, 0.002, TRACKPAD_Z]}>
        <meshPhysicalMaterial color={palette.deck} metalness={0.3} roughness={0.22} clearcoat={0.8} />
      </mesh>

      {/* Dobradiça: o eixo fica na borda de trás da base */}
      <group ref={hingeRef} position={[0, 0.005, -BASE_DEPTH / 2 + 0.03]} rotation={[lidAngle, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, WIDTH - 0.6, 24]} />
          <meshPhysicalMaterial color={palette.frame} metalness={1} roughness={0.3} />
        </mesh>

        {/* Tampa: costas de alumínio, frente de vidro preto com a tela */}
        <group position={[0, LID_HEIGHT / 2 + 0.02, 0]}>
          <mesh geometry={lid}>
            <meshPhysicalMaterial attach="material-0" color={palette.body} metalness={0.6} roughness={0.42} />
            <meshPhysicalMaterial attach="material-1" color={palette.frame} metalness={1} roughness={0.25} />
          </mesh>
          <mesh geometry={bezel} position={[0, 0, LID_THICKNESS / 2 + 0.001]}>
            <meshPhysicalMaterial color={BEZEL} roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          <DeviceScreen
            texture={screenTexture}
            width={WIDTH - 0.17}
            height={LID_HEIGHT - 0.2}
            radius={0.02}
            position={[0, -0.03, LID_THICKNESS / 2 + 0.002]}
          />

          {/* Câmera e LED na moldura de cima */}
          <group position={[0, LID_HEIGHT / 2 - 0.05, LID_THICKNESS / 2 + 0.003]}>
            <mesh>
              <circleGeometry args={[0.014, 20]} />
              <meshPhysicalMaterial color="#05060A" roughness={0.05} clearcoat={1} />
            </mesh>
            <mesh position={[0.045, 0, 0]}>
              <circleGeometry args={[0.006, 16]} />
              <meshStandardMaterial
                color={LED_COLOR}
                emissive={LED_COLOR}
                emissiveIntensity={LED_INTENSITY}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
