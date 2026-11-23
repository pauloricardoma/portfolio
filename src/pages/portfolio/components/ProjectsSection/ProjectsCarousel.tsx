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
import type { Group } from "three";
import type { IProject } from "~/interfaces/portfolio/IProject";
import DevicePhone from "~/components/3D/DevicePhone";
import DeviceLaptop from "~/components/3D/DeviceLaptop";

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
  /** Cor da carcaça em hex (Three.js não lê var(--…)) */
  deviceColor: string;
  /** Desliga o arraste (no celular, para não bloquear a rolagem da página) */
  dragEnabled?: boolean;
  /** Raio do círculo orbital: maior = aparelhos mais afastados do centro */
  orbitRadius?: number;
  /** Escala do notebook (menor no celular, para não cobrir os de trás) */
  laptopScale?: number;
  /** Troca instantânea, sem giro */
  reducedMotion?: boolean;
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
  deviceColor,
  dragEnabled = true,
  orbitRadius = 3.2,
  laptopScale = 1.3,
  reducedMotion = false,
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
      const z = Math.cos(itemAngle) * radius;

      device.position.x = Math.sin(itemAngle) * radius;
      device.position.z = z;

      /** z vai de -raio (atrás) a +raio (frente) → escala de 0.6 a 1.1 */
      device.scale.setScalar(0.6 + ((z + radius) / (radius * 2)) * 0.5);

      /** De frente para a câmera quando está na posição frontal */
      device.rotation.y = -itemAngle;
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
            <DevicePhone screenTexture={project.screenshot} color={deviceColor} />
          ) : (
            <DeviceLaptop screenTexture={project.screenshot} color={deviceColor} scale={laptopScale} />
          )}
        </group>
      ))}
    </group>
  );
}
