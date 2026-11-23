/**
 * LaptopKeyboard.tsx — Teclado do notebook com InstancedMesh.
 *
 * Todas as teclas são UMA geometria desenhada N vezes (uma draw call).
 * Cada instância tem posição e escala próprias: a largura vem do layout
 * (em "unidades" de tecla, como num teclado real: Tab 1.5u, Caps 1.75u,
 * Shift 2.25u, espaço 5u) e a fileira de funções tem meia altura.
 *
 * O teclado fica deitado no plano xz, com a face de cima em y = 0.
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import { Object3D, type InstancedMesh } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

interface LaptopKeyboardProps {
  color: string;
  /** Largura total disponível para o teclado */
  width: number;
}

/** Larguras em unidades; cada fileira soma 14.5u */
const LAYOUT: number[][] = [
  [...Array(13).fill(1), 1.5],
  [...Array(13).fill(1), 1.5],
  [1.5, ...Array(12).fill(1), 1],
  [1.75, ...Array(11).fill(1), 1.75],
  [2.25, ...Array(10).fill(1), 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1],
];
const ROW_UNITS = 14.5;
/** A fileira de funções (a primeira) tem meia altura */
const ROW_HEIGHT_FACTOR = [0.5, 1, 1, 1, 1, 1];
const KEY_TRAVEL = 0.014;

export default function LaptopKeyboard({ color, width }: LaptopKeyboardProps) {
  const meshRef = useRef<InstancedMesh>(null);

  const unit = width / ROW_UNITS;
  const gap = unit * 0.14;

  const keys = useMemo(() => {
    const list: { x: number; z: number; w: number; d: number }[] = [];
    let z = 0;

    LAYOUT.forEach((row, rowIndex) => {
      const depth = unit * ROW_HEIGHT_FACTOR[rowIndex];
      let x = -width / 2;
      row.forEach((units) => {
        const w = units * unit;
        list.push({ x: x + w / 2, z: z + depth / 2, w: w - gap, d: depth - gap });
        x += w;
      });
      z += depth;
    });

    // Centraliza o bloco em z
    return list.map((key) => ({ ...key, z: key.z - z / 2 }));
  }, [unit, gap, width]);

  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new Object3D();
    keys.forEach((key, i) => {
      dummy.position.set(key.x, KEY_TRAVEL / 2, key.z);
      dummy.scale.set(key.w, KEY_TRAVEL, key.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [keys]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, keys.length]}>
      <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
    </instancedMesh>
  );
}

/** Profundidade total do teclado, para o notebook posicionar o poço */
export function keyboardDepth(width: number) {
  const unit = width / ROW_UNITS;
  return ROW_HEIGHT_FACTOR.reduce((sum, factor) => sum + unit * factor, 0);
}
