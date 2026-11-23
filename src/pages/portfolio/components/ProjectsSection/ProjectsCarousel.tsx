/**
 * ProjectsCarousel.tsx — Carrossel orbital 3D dos projetos.
 *
 * CONCEITOS CHAVE:
 *
 * 1. POSICIONAMENTO EM CÍRCULO (trigonometria):
 *    Cada aparelho recebe um ângulo base = (index / total) × 2π e fica em
 *    x = raio × sin(ângulo), z = raio × cos(ângulo). Somando o ângulo atual
 *    do carrossel a todos, o conjunto gira mantendo as posições relativas.
 *
 * 2. CONTROLADO DE FORA:
 *    O projeto ativo (`activeIndex`) mora no `usePortfolio`. Botões, dots,
 *    teclado, clique e arraste só pedem a troca com `onSelect`; o carrossel
 *    reage ao `activeIndex` girando pelo caminho mais curto.
 *
 * 3. GSAP + useFrame:
 *    O GSAP anima o ângulo-alvo (um ref, sem re-render) e o useFrame
 *    aproxima o ângulo atual do alvo a cada frame (lerp), o que dá inércia.
 *    Com reduced motion, o ângulo pula direto para o alvo.
 *
 * 4. ESCALA POR PROFUNDIDADE: quanto mais perto da câmera (z maior), maior.
 *
 * 5. ARRASTE: eventos de pointer no <canvas> (não nos meshes, que perdem o
 *    pointer entre um objeto e outro). Ao soltar, encaixa no mais próximo.
 */
import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { Group, Mesh } from "three";
import type { IProject } from "~/interfaces/portfolio/IProject";
import DevicePhone from "~/components/3D/DevicePhone";
import DeviceLaptop from "~/components/3D/DeviceLaptop";
import FloorShadow from "~/components/3D/FloorShadow";
import { FLOOR_Y, SHADOW_SIZE, type DevicePalette } from "~/components/3D/config";

const TWO_PI = Math.PI * 2;

/** Arraste menor que isso (px) ainda conta como clique no aparelho */
const CLICK_MAX_PX = 6;

/** Sensibilidade do arraste: radianos por pixel */
const DRAG_SENSITIVITY = 0.01;

interface ProjectsCarouselProps {
  projects: IProject[];
  activeIndex: number;
  /** Pede a troca de projeto (o estado fica fora da cena) */
  onSelect: (index: number) => void;
  /** Cores dos aparelhos em hex, por tema (Three.js não lê var(--…)) */
  palette: DevicePalette;
  /** Desliga o arraste (no celular, para não bloquear a rolagem da página) */
  dragEnabled?: boolean;
  /** Raio do círculo orbital: maior = aparelhos mais afastados do centro */
  orbitRadius?: number;
  /** Escala do notebook (menor no celular, para não cobrir os de trás) */
  laptopScale?: number;
  /** Escala do celular (menor no palco estreito do celular) */
  phoneScale?: number;
  /** Troca instantânea, sem giro */
  reducedMotion?: boolean;
  /** Sombra no piso (desliga no nível 2 de degradação) */
  shadows?: boolean;
  shadowOpacity?: number;
}

/** Diferença angular em [-π, π): o giro mais curto de `from` até `to` */
function shortestDelta(from: number, to: number) {
  const diff = (to - from) % TWO_PI;
  return ((diff + 3 * Math.PI) % TWO_PI) - Math.PI;
}

export default function ProjectsCarousel({
  projects,
  activeIndex,
  onSelect,
  palette,
  dragEnabled = true,
  orbitRadius = 3.2,
  laptopScale = 1,
  phoneScale = 1.1,
  reducedMotion = false,
  shadows = true,
  shadowOpacity = 0.4,
}: ProjectsCarouselProps) {
  const radius = orbitRadius;
  const count = projects.length;
  const anglePerItem = TWO_PI / count;

  /**
   * Dados que mudam todo frame ficam em ref (sem re-render).
   * angleRef: ângulo desenhado. targetAngleRef: para onde ele está indo.
   */
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const deviceRefs = useRef<(Group | null)[]>([]);
  const shadowRefs = useRef<(Mesh | null)[]>([]);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  /** Gira até o projeto `index` pelo caminho mais curto */
  const rotateTo = useCallback(
    (index: number) => {
      const from = targetAngleRef.current;
      const to = from + shortestDelta(from, -index * anglePerItem);

      gsap.killTweensOf(targetAngleRef);
      if (reducedMotion) {
        targetAngleRef.current = to;
        angleRef.current = to;
        return;
      }
      gsap.to(targetAngleRef, { current: to, duration: 0.8, ease: "power2.inOut" });
    },
    [anglePerItem, reducedMotion]
  );

  useEffect(() => {
    rotateTo(activeIndex);
  }, [activeIndex, rotateTo]);

  useEffect(() => () => {
    gsap.killTweensOf(targetAngleRef);
  }, []);

  useFrame(() => {
    angleRef.current = reducedMotion
      ? targetAngleRef.current
      : angleRef.current + (targetAngleRef.current - angleRef.current) * 0.08;

    for (let i = 0; i < count; i++) {
      const device = deviceRefs.current[i];
      if (!device) continue;

      const itemAngle = i * anglePerItem + angleRef.current;
      const x = Math.sin(itemAngle) * radius;
      const z = Math.cos(itemAngle) * radius;
      /** z vai de -raio (atrás) a +raio (frente) → escala de 0.6 a 1.1 */
      const scale = 0.6 + ((z + radius) / (radius * 2)) * 0.5;

      device.position.x = x;
      device.position.z = z;
      device.scale.setScalar(scale);

      /** De frente para a câmera quando está na posição frontal */
      device.rotation.y = -itemAngle;

      /** A sombra acompanha no piso (o plano está deitado: girar em z = girar no piso) */
      const shadow = shadowRefs.current[i];
      if (shadow) {
        shadow.position.set(x, FLOOR_Y, z);
        shadow.scale.setScalar(scale);
        shadow.rotation.z = -itemAngle;
      }
    }
  });

  /** Ao soltar o arraste, encaixa no projeto mais perto da frente */
  const snapToNearest = useCallback(() => {
    const nearest = Math.round(-targetAngleRef.current / anglePerItem);
    const index = ((nearest % count) + count) % count;
    rotateTo(index);
    onSelect(index);
  }, [anglePerItem, count, rotateTo, onSelect]);

  const { gl } = useThree();

  useEffect(() => {
    if (!dragEnabled) return;

    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      gsap.killTweensOf(targetAngleRef);
      dragStartAngle.current = targetAngleRef.current;
      canvas.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStartX.current;
      targetAngleRef.current = dragStartAngle.current + deltaX * DRAG_SENSITIVITY;
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      snapToNearest();
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.style.touchAction = "none";

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.style.touchAction = "";
    };
  }, [gl, snapToNearest, dragEnabled]);

  return (
    <group>
      {projects.map((project, index) => (
        <group
          key={project.id}
          ref={(el) => {
            deviceRefs.current[index] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
            /** Fim de um arraste não é clique */
            if (e.delta > CLICK_MAX_PX) return;
            onSelect(index);
          }}
        >
          {project.type === "mobile" ? (
            <DevicePhone screenTexture={project.screenshot} palette={palette} scale={phoneScale} />
          ) : (
            <DeviceLaptop screenTexture={project.screenshot} palette={palette} scale={laptopScale} />
          )}
        </group>
      ))}

      {shadows &&
        projects.map((project, index) => (
          <FloorShadow
            key={`shadow-${project.id}`}
            ref={(el) => {
              shadowRefs.current[index] = el;
            }}
            size={[...SHADOW_SIZE[project.type]]}
            opacity={shadowOpacity}
          />
        ))}
    </group>
  );
}
