/**
 * ProjectsCarousel.tsx — Carrossel orbital 3D dos projetos.
 *
 * CONCEITOS CHAVE:
 *
 * 1. POSICIONAMENTO EM CÍRCULO (trigonometria):
 *    Pra distribuir N objetos em círculo, usamos:
 *    - x = raio × sin(ângulo)
 *    - z = raio × cos(ângulo)
 *    Cada objeto recebe um ângulo base = (index / total) × 2π (volta completa).
 *    Somamos "currentAngle" (estado) pra girar o carrossel inteiro.
 *
 *    Imagine um relógio: 3 objetos a cada 120° (360/3).
 *    Ao mudar currentAngle, todos giram juntos mantendo as posições relativas.
 *
 * 2. GSAP ANIMANDO THREE.JS:
 *    GSAP pode animar QUALQUER propriedade numérica de qualquer objeto JS.
 *    Isso inclui objetos do Three.js:
 *    - mesh.position.x, mesh.rotation.y, mesh.scale.x
 *    Então em vez de usar spring physics do drei, usamos gsap.to()
 *    pra transições suaves ao trocar o item em foco.
 *
 * 3. useFrame (loop de renderização):
 *    Roda a cada frame (~60fps). Aqui calculamos as posições dos
 *    dispositivos baseado no ângulo atual. É como o "game loop"
 *    de um jogo — atualiza posições → renderiza → repete.
 *
 * 4. ESCALA POR PROFUNDIDADE:
 *    Objetos mais perto da câmera (z maior) ficam maiores.
 *    Isso cria a sensação de profundidade natural.
 *    Calculamos a escala baseado na posição z: mais perto = maior.
 *
 * 5. INTERAÇÃO (drag/click):
 *    @use-gesture/react (já incluso no drei) captura gestos.
 *    onPointerDown/Move/Up pra drag horizontal → gira o carrossel.
 *    Click em um dispositivo → anima até ele ficar na frente.
 */
import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "styled-components";
import gsap from "gsap";
import type { Group } from "three";
import type { IProject } from "~/interfaces/home/IProject";
import DevicePhone from "~/components/3D/DevicePhone";
import DeviceLaptop from "~/components/3D/DeviceLaptop";

interface ProjectsCarouselProps {
  projects: IProject[];
  /** Callback quando o projeto em foco muda */
  onFocusChange: (index: number) => void;
  /** Índice do projeto em foco */
  focusedIndex: number;
}

/** Raio do círculo orbital (distância do centro) */
const ORBIT_RADIUS = 3.2;

export default function ProjectsCarousel({
  projects,
  onFocusChange,
  focusedIndex,
}: ProjectsCarouselProps) {
  const theme = useTheme();

  /**
   * angleRef: ângulo atual do carrossel (em radianos).
   * Usamos useRef em vez de useState porque:
   * - useState causa re-render a cada mudança
   * - useRef atualiza silenciosamente (sem re-render)
   * - No useFrame (60fps), re-render a cada frame seria péssimo pra performance
   *
   * Regra: dados que mudam TODO FRAME → useRef. Dados de UI → useState.
   */
  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const groupRef = useRef<Group>(null);
  const deviceRefs = useRef<(Group | null)[]>([]);

  /** Estado de drag */
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  /**
   * Ângulo que cada projeto ocupa no círculo.
   * Com 3 projetos: 2π / 3 = ~2.094 radianos = 120°.
   * Com 4: 90°. Com 6: 60°. Escala automaticamente.
   */
  const anglePerItem = (Math.PI * 2) / projects.length;

  /**
   * navigateTo — Anima o carrossel até um projeto específico.
   *
   * gsap.to() anima de um valor ATUAL para um valor DESTINO.
   * Aqui animamos targetAngleRef.current (que o useFrame interpola).
   *
   * O cálculo do ângulo: -index * anglePerItem
   * O sinal negativo é porque giramos "ao contrário" pra trazer
   * o item pro frente (index 0 = frente, index 1 = 120° horário, etc.)
   *
   * Cuidado com wrapping: se estamos em 350° e queremos ir pra 10°,
   * não queremos girar 340° (caminho longo). Queremos girar 20° (caminho curto).
   * O cálculo com modular arithmetic resolve isso.
   */
  const navigateTo = useCallback(
    (index: number) => {
      const targetAngle = -index * anglePerItem;

      /** Calcula o caminho mais curto (evita girar 300° quando 60° basta) */
      const current = targetAngleRef.current;
      const diff = targetAngle - current;
      const normalizedDiff =
        ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;

      gsap.to(targetAngleRef, {
        current: current + normalizedDiff,
        duration: 0.8,
        ease: "power2.inOut",
      });

      onFocusChange(index);
    },
    [anglePerItem, onFocusChange]
  );

  /**
   * useFrame — Roda a cada frame de renderização.
   *
   * Aqui fazemos a INTERPOLAÇÃO (lerp) do ângulo:
   * - angleRef.current se move suavemente em direção a targetAngleRef.current
   * - lerp: valor += (destino - valor) * fator
   * - fator 0.08 = suave e com inércia (quanto menor, mais suave)
   *
   * Depois posicionamos cada dispositivo no círculo usando trigonometria.
   */
  useFrame(() => {
    /** Lerp (Linear Interpolation): move suavemente em direção ao target */
    angleRef.current +=
      (targetAngleRef.current - angleRef.current) * 0.08;

    projects.forEach((project, i) => {
      const device = deviceRefs.current[i];
      if (!device) return;

      /**
       * Cálculo da posição no círculo:
       *
       * itemAngle = ângulo base do item (i × anglePerItem) + rotação do carrossel
       *
       * Posição em coordenadas polares → cartesianas:
       * x = RAIO × sin(ângulo) → posição horizontal
       * z = RAIO × cos(ângulo) → profundidade (frente/trás)
       *
       * y = 0 (todos no mesmo nível vertical)
       */
      const itemAngle = i * anglePerItem + angleRef.current;
      const x = Math.sin(itemAngle) * ORBIT_RADIUS;
      const z = Math.cos(itemAngle) * ORBIT_RADIUS;

      device.position.x = x;
      device.position.z = z;

      /**
       * ESCALA baseada na profundidade (z):
       *
       * z varia de -ORBIT_RADIUS (atrás) a +ORBIT_RADIUS (frente).
       * Normalizamos pra 0-1: (z + RAIO) / (2 × RAIO)
       * Depois mapeamos pra escala: 0.6 (atrás) a 1.1 (frente)
       *
       * Isso cria perspectiva natural: perto = grande, longe = pequeno.
       */
      const normalizedZ = (z + ORBIT_RADIUS) / (ORBIT_RADIUS * 2);
      const scale = 0.6 + normalizedZ * 0.5;
      device.scale.setScalar(scale);

      /**
       * OPACIDADE baseada na profundidade:
       * Itens atrás ficam mais transparentes.
       * Isso reforça a sensação de profundidade.
       *
       * Acessamos o material dos filhos (meshes) do grupo
       * e ajustamos a opacidade.
       */
      device.traverse((child) => {
        if ("material" in child && child.material) {
          const mat = child.material as { opacity: number; transparent: boolean };
          mat.transparent = true;
          mat.opacity = 1;
          // mat.opacity = 0.4 + normalizedZ * 0.6;
        }
      });

      /**
       * ROTAÇÃO Y: o dispositivo fica de frente pra câmera quando está na posição frontal.
       * rotation.y = itemAngle faz ele "olhar" pra fora do círculo.
       * O sinal negativo faz ele olhar pra câmera.
       */
      device.rotation.y = -itemAngle;
    });
  });

  /**
   * Handlers de drag — girar o carrossel arrastando.
   *
   * onPointerDown: salva posição inicial do mouse e ângulo atual.
   * onPointerMove: calcula delta do mouse → converte em rotação.
   * onPointerUp: "snapa" pro item mais próximo.
   *
   * O multiplicador 0.01 controla a sensibilidade do drag.
   * setPointerCapture: garante que o mouse continua capturado
   * mesmo se sair do Canvas (evita o drag "travar").
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartAngle.current = targetAngleRef.current;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStartX.current;
      targetAngleRef.current = dragStartAngle.current + deltaX * 0.01;
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    /**
     * Snap to nearest — ao soltar o drag, "encaixa" no item mais próximo.
     *
     * Dividimos o ângulo atual pelo ângulo por item e arredondamos.
     * Isso dá o índice do item mais próximo da posição frontal.
     */
    const currentAngle = targetAngleRef.current;
    const nearestIndex =
      Math.round(-currentAngle / anglePerItem) % projects.length;
    const normalizedIndex =
      ((nearestIndex % projects.length) + projects.length) % projects.length;

    navigateTo(normalizedIndex);
  }, [anglePerItem, projects.length, navigateTo]);

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown as unknown as (e: any) => void}
      onPointerMove={handlePointerMove as unknown as (e: any) => void}
      onPointerUp={handlePointerUp as unknown as () => void}
    >
      {projects.map((project, index) => (
        <group
          key={project.id}
          ref={(el) => {
            deviceRefs.current[index] = el;
          }}
          onClick={(e) => {
            /**
             * stopPropagation: impede que o click "suba" pro grupo pai.
             * Sem isso, clicar no dispositivo também trigaria o drag.
             */
            e.stopPropagation();
            navigateTo(index);
          }}
        >
          {project.type === "mobile" ? (
            <DevicePhone screenTexture={project.screenshot} color={theme.colors.tertiary.tertiary} />
          ) : (
            <DeviceLaptop screenTexture={project.screenshot} color={theme.colors.tertiary.tertiary} />
          )}
        </group>
      ))}
    </group>
  );
}
