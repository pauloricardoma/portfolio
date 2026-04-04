/**
 * DeviceLaptop.tsx — Modelo 3D de um MacBook/laptop.
 *
 * CONCEITOS NOVOS:
 *
 * 1. Composição de meshes:
 *    O laptop é montado com DUAS peças: base (teclado) + tela.
 *    Cada peça é um RoundedBox separado, posicionado manualmente.
 *    A tela é rotacionada em X pra simular o ângulo de abertura.
 *
 * 2. rotation: [x, y, z] — rotação em RADIANOS (não graus).
 *    - Math.PI = 180° (meia volta)
 *    - Math.PI / 2 = 90° (um quarto de volta)
 *    - Math.PI * -0.05 = inclinação sutil (~9°)
 *    Pra converter: radianos = graus × (Math.PI / 180)
 *
 * 3. Hierarquia de grupo:
 *    <group> (laptop inteiro)
 *      └── <group> (tela — rotacionada como dobradiça)
 *            ├── RoundedBox (moldura da tela)
 *            └── mesh (tela com screenshot)
 *    Rotacionar o grupo da tela faz ela "abrir" como uma dobradiça real.
 *    O pivot (ponto de rotação) fica na base da tela (onde a dobradiça seria).
 *
 * 4. useFrame (do R3F):
 *    Hook que roda a CADA FRAME de renderização (~60x por segundo).
 *    Usado aqui pra criar animação de "respiração" (float sutil).
 *    delta = tempo desde o último frame (pra animação independente de FPS).
 *    NÃO use useFrame pra lógica pesada — roda 60x/s!
 */
import { useRef } from "react";
import { RoundedBox, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import LaptopKeyboard from "./LaptopKeyboard";

interface DeviceLaptopProps {
  screenTexture: string;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/** Proporções do MacBook (~14") */
const BASE_WIDTH = 2.3;
const BASE_DEPTH = 1.6;
const BASE_HEIGHT = 0.06;
const SCREEN_WIDTH = 2.3;
const SCREEN_HEIGHT = 1.5;
const SCREEN_DEPTH = 0.04;
const SCREEN_INSET = 0.08;

export default function DeviceLaptop({
  screenTexture,
  color = "#1a1a2e",
  position = [0, -0.15, 0],
  rotation = [0, 0, 0],
  scale = 1.3,
}: DeviceLaptopProps) {
  const groupRef = useRef<Group>(null);
  const texture = useTexture(screenTexture);

  /**
   * useFrame — Animação de "respiração" (float).
   *
   * O laptop sobe e desce suavemente usando Math.sin() (onda senoidal).
   * state.clock.elapsedTime: tempo total desde o início (em segundos).
   *
   * Math.sin(tempo * velocidade) * amplitude:
   * - velocidade 1.5 = ciclo a cada ~4 segundos
   * - amplitude 0.03 = move apenas 0.03 unidades (sutil, quase imperceptível)
   *
   * Isso dá vida ao objeto sem distrair o usuário.
   */
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        (position?.[1] || 0) + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/**
       * BASE DO LAPTOP (teclado + trackpad)
       *
       * Rotação X de -Math.PI/2 (90°) pra deitar o box horizontalmente.
       * Sem isso, o RoundedBox ficaria em pé (como uma parede).
       */}
      <RoundedBox
        args={[BASE_WIDTH, BASE_DEPTH, BASE_HEIGHT]}
        radius={0.03}
        smoothness={4}
        rotation={[-Math.PI / 3, 0, 0]}
        position={[0, -0.25, -0.06]}
      >
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.2} />
      </RoundedBox>

      {/**
       * TECLADO 3D — posicionado sobre a base do laptop.
       *
       * A base está rotacionada em -Math.PI/3 (~60°), então o teclado
       * precisa da mesma rotação pra ficar "colado" na superfície.
       *
       * position: mesma posição da base, com ajuste em z pra ficar
       * na face superior (BASE_HEIGHT/2 acima da superfície).
       *
       * O y interno do group compensa o offset do layout QWERTY
       * (as teclas são calculadas de cima pra baixo, começando em y=0).
       */}
      <group rotation={[-Math.PI / 3, 0, 0]} position={[0, -0.25, -0.06]}>
        <group position={[0, 0.46, BASE_HEIGHT / 2 + 0.001]}>
          <LaptopKeyboard color={color} />
        </group>
      </group>

      {/**
       * GRUPO DA TELA — posicionado na "dobradiça" (borda traseira da base).
       *
       * position: [0, 0, -BASE_DEPTH/2] = borda de trás da base.
       * rotation: [0.2, 0, 0] = inclinação de ~11° pra trás
       * (como um laptop aberto normalmente, não 90° reto).
       *
       * Dentro deste grupo:
       * - A tela é posicionada com y=SCREEN_HEIGHT/2 pra que o
       *   ponto de rotação fique na BASE da tela (dobradiça),
       *   não no centro dela.
       */}
      <group position={[0, 0, -BASE_DEPTH / 2]} rotation={[0.2, 0, 0]}>
        {/* Moldura da tela */}
        <RoundedBox
          args={[SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_DEPTH]}
          radius={0.05}
          smoothness={4}
          position={[0, SCREEN_HEIGHT / 1.68, 0]}
        >
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.2} />
        </RoundedBox>

        {/* Tela com screenshot */}
        <mesh position={[0, SCREEN_HEIGHT / 1.68, SCREEN_DEPTH / 2 + 0.001]}>
          <planeGeometry
            args={[SCREEN_WIDTH - SCREEN_INSET, SCREEN_HEIGHT - SCREEN_INSET]}
          />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
