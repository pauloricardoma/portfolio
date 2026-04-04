/**
 * LaptopKeyboard.tsx — Teclado 3D para o modelo de laptop.
 *
 * CONCEITOS THREE.JS USADOS:
 *
 * 1. InstancedMesh:
 *    Renderiza N cópias da mesma geometria+material numa ÚNICA draw call.
 *    Sem instancing: 26 teclas = 26 draw calls (GPU processa cada uma separada).
 *    Com instancing: 26 teclas = 1 draw call (GPU desenha todas de uma vez).
 *
 *    Como funciona:
 *    - Cria um <instancedMesh> com args={[geometry, material, count]}
 *    - Cada instância recebe uma MATRIZ 4x4 (posição + rotação + escala)
 *    - setMatrixAt(index, matrix) define onde cada cópia aparece
 *    - instanceMatrix.needsUpdate = true avisa a GPU pra atualizar
 *
 * 2. Object3D como "dummy" (fantoche):
 *    Pra calcular a matriz de cada tecla, usamos um Object3D temporário.
 *    Setamos position/rotation/scale nele, chamamos updateMatrix(),
 *    e copiamos a matrix resultante pro instancedMesh.
 *    É um padrão comum no Three.js pra posicionar instâncias.
 *
 * 3. RoundedBoxGeometry (three-stdlib):
 *    Geometria de caixa com bordas arredondadas — usada pra cada tecla
 *    ter aquele visual suave de tecla real de MacBook.
 *
 * 4. Layout QWERTY:
 *    As teclas são posicionadas em 4 linhas (como um teclado real):
 *    - Linha 1: Q W E R T Y U I O P  (10 teclas)
 *    - Linha 2:  A S D F G H J K L   (9 teclas, offset horizontal)
 *    - Linha 3:   Z X C V B N M      (7 teclas, offset maior)
 *    - Linha 4:     [espaço]          (barra separada, geometria diferente)
 *
 *    O offset horizontal de cada linha simula o escalonamento real
 *    de um teclado QWERTY (cada linha começa um pouco mais à direita).
 */
import { useRef, useEffect, useMemo } from "react";
import { Object3D } from "three";
import type { InstancedMesh } from "three";
import { RoundedBox } from "@react-three/drei";
import { RoundedBoxGeometry } from "three-stdlib";

interface LaptopKeyboardProps {
  /** Cor das teclas (hex) */
  color?: string;
}

/**
 * Layout QWERTY — quantidade de teclas por linha.
 * Não precisamos das letras (não renderizamos texto 3D),
 * só da quantidade pra calcular posições no grid.
 */
const ROWS = [12, 12, 12, 12, 12];

/**
 * Dimensões das teclas — proporcionais à base do laptop (2.3 x 1.6).
 * Teclas de laptop são mais largas e rasas que teclas de celular.
 */
const KEY_WIDTH = 0.14;
const KEY_HEIGHT = 0.14;
const KEY_DEPTH = 0.02;
const KEY_GAP = 0.02;
const ROW_GAP = 0.03;
const KEY_RADIUS = 0.02;
const SPACE_BAR_HEIGHT = 0.44;

export default function LaptopKeyboard({ color = "#2a2a3e" }: LaptopKeyboardProps) {
  const meshRef = useRef<InstancedMesh>(null);

  /**
   * Calcula a posição [x, y] de cada tecla nas 3 linhas.
   *
   * Para cada linha:
   * - Calcula a largura total da linha (teclas + gaps)
   * - startX = -larguraTotal/2 + metade de uma tecla (centraliza)
   * - Cada tecla: x = startX + index * (KEY_WIDTH + KEY_GAP)
   * - y diminui a cada linha (vai descendo)
   *
   * O offset horizontal é automático: linhas com menos teclas
   * ficam naturalmente centralizadas porque startX muda.
   */
  const keyPositions = useMemo(() => {
    const positions: [number, number][] = [];

    ROWS.forEach((keyCount, rowIndex) => {
      const rowWidth = keyCount * KEY_WIDTH + (keyCount - 1) * KEY_GAP;
      const startX = -rowWidth / 2 + KEY_WIDTH / 2;

      for (let i = 0; i < keyCount; i++) {
        const x = startX + i * (KEY_WIDTH + KEY_GAP);
        const y = -rowIndex * (KEY_HEIGHT + ROW_GAP);
        positions.push([x, y]);
      }
    });

    return positions;
  }, []);

  /** Total de teclas normais (Q-P + A-L + Z-M = 26) */
  const totalKeys = keyPositions.length;

  /**
   * Geometria compartilhada — criada UMA vez e reusada por todas as instâncias.
   * useMemo evita recriar a geometria a cada render.
   *
   * RoundedBoxGeometry(largura, altura, profundidade, segmentos, raio)
   * - segmentos=2: subdivisões nas curvas (2 basta pra teclas pequenas)
   * - raio: arredondamento das bordas
   */
  const geometry = useMemo(
    () => new RoundedBoxGeometry(KEY_WIDTH, KEY_HEIGHT, KEY_DEPTH, 2, KEY_RADIUS),
    []
  );

  /**
   * useEffect — Posiciona cada instância usando o padrão "dummy Object3D".
   *
   * Fluxo:
   * 1. Cria um Object3D temporário (dummy)
   * 2. Pra cada tecla: seta position no dummy → updateMatrix() → copia pro instancedMesh
   * 3. instanceMatrix.needsUpdate = true → avisa a GPU que as posições mudaram
   *
   * Por que useEffect e não useFrame?
   * Porque as posições são ESTÁTICAS — calculamos uma vez e pronto.
   * useFrame seria desperdício (recalcular 60x/s algo que não muda).
   */
  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new Object3D();

    keyPositions.forEach(([x, y], i) => {
      dummy.position.set(x, y, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [keyPositions]);

  /**
   * Barra de espaço — posição e largura.
   * Fica abaixo das 3 linhas de letras.
   * Largura = 5 teclas + 4 gaps (proporção real de um teclado).
   */
  const spaceBarY = -ROWS.length * (KEY_HEIGHT + ROW_GAP * 2.2); // um pouco abaixo da última linha
  const spaceBarWidth = KEY_WIDTH * 5 + KEY_GAP * 4;

  return (
    <group>
      {/**
       * TECLAS NORMAIS — InstancedMesh
       *
       * <instancedMesh> recebe:
       * - ref: pra acessar e setar as matrizes via setMatrixAt
       * - args={[geometry, material, count]}: geometria compartilhada + quantidade
       * - geometry como prop, material como child (pra controle visual)
       */}
      <instancedMesh ref={meshRef} args={[geometry, undefined, totalKeys]}>
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </instancedMesh>

      {/**
       * BARRA DE ESPAÇO — Mesh separado
       *
       * Geometria diferente (mais larga que as teclas normais),
       * então não pode ser instância do mesmo InstancedMesh.
       */}
      <RoundedBox
        args={[spaceBarWidth, SPACE_BAR_HEIGHT, KEY_DEPTH]}
        radius={KEY_RADIUS}
        smoothness={2}
        position={[0, spaceBarY, 0]}
      >
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </RoundedBox>
    </group>
  );
}
