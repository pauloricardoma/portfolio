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
import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { Group } from "three";
import type { IProject } from "~/interfaces/portfolio/IProject";
import DevicePhone from "~/components/3D/DevicePhone";
import DeviceLaptop from "~/components/3D/DeviceLaptop";
import { colors } from "~/styles/tokens";

/**
 * Carcaça dos aparelhos: grafite fixo nos dois temas. Three.js não lê var(--…),
 * por isso o hex vem dos tokens. Cor por tema fica para a spec 0007.
 */
const DEVICE_COLOR = colors.dark.line;

interface ProjectsCarouselProps {
  projects: IProject[];
  /** Callback quando o projeto em foco muda */
  onFocusChange: (index: number) => void;
  /** Índice do projeto em foco */
  focusedIndex: number;
  /** Desabilita drag (mobile — pra não bloquear scroll da página) */
  dragEnabled?: boolean;
  /** Raio do círculo orbital — maior = devices mais afastados do centro */
  orbitRadius?: number;
  /** Escala do laptop (default 1.3, no mobile menor pra não cobrir os de trás) */
  laptopScale?: number;
}

/** Raio do círculo orbital (distância do centro) */
const ORBIT_RADIUS = 3.2;

export default function ProjectsCarousel({
  projects,
  onFocusChange,
  focusedIndex,
  dragEnabled = true,
  orbitRadius = ORBIT_RADIUS,
  laptopScale = 1.3,
}: ProjectsCarouselProps) {
  const radius = orbitRadius;

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
      const x = Math.sin(itemAngle) * radius;
      const z = Math.cos(itemAngle) * radius;

      device.position.x = x;
      device.position.z = z;

      /**
       * ESCALA baseada na profundidade (z):
       *
       * z varia de -radius (atrás) a +radius (frente).
       * Normalizamos pra 0-1: (z + raio) / (2 × raio)
       * Depois mapeamos pra escala: 0.6 (atrás) a 1.1 (frente)
       */
      const normalizedZ = (z + radius) / (radius * 2);
      const scale = 0.6 + normalizedZ * 0.5;
      device.scale.setScalar(scale);

      /**
       * NOTA: o traverse que existia aqui percorria TODOS os filhos
       * de cada device a cada frame (60fps) só pra setar opacity=1.
       * Isso é extremamente pesado em mobile — removido.
       * Se precisar de opacidade por profundidade no futuro,
       * setar uma vez no mount e atualizar só quando mudar.
       */

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
  /**
   * snapToNearest — "encaixa" no item mais próximo da frente.
   *
   * Dividimos o ângulo atual pelo ângulo por item e arredondamos.
   * Isso dá o índice do item mais próximo da posição frontal.
   * Extraímos numa função separada pra reutilizar em pointerUp e pointerLeave.
   */
  const snapToNearest = useCallback(() => {
    const currentAngle = targetAngleRef.current;
    const nearestIndex =
      Math.round(-currentAngle / anglePerItem) % projects.length;
    const normalizedIndex =
      ((nearestIndex % projects.length) + projects.length) % projects.length;

    navigateTo(normalizedIndex);
  }, [anglePerItem, projects.length, navigateTo]);

  /**
   * DRAG VIA EVENTOS DOM NO CANVAS
   *
   * Por que NÃO usar onPointerDown/Move/Up do R3F (no <group>)?
   * Porque em R3F esses eventos são por MESH — se o pointer sai de um
   * mesh pro espaço vazio (ou entre meshes), dispara onPointerLeave
   * e o drag cancela no meio. Isso causa o bug de "girar e voltar".
   *
   * Solução: escutar pointer events direto no <canvas> DOM via useThree().
   * O canvas é um elemento HTML contínuo — não tem "buracos" entre meshes.
   * Pointer capture no canvas garante que move/up chegam mesmo se o
   * pointer sair da janela.
   */
  const { gl } = useThree();

  useEffect(() => {
    /**
     * Sem drag (mobile): não registra nenhum evento no canvas.
     * O scroll da página funciona normalmente.
     * Navegação é feita só por click nos devices, dots e setas.
     */
    if (!dragEnabled) return;

    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartAngle.current = targetAngleRef.current;
      canvas.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStartX.current;
      targetAngleRef.current = dragStartAngle.current + deltaX * 0.01;
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      snapToNearest();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.style.touchAction = "none";

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.style.touchAction = "";
    };
  }, [gl, snapToNearest, dragEnabled]);

  return (
    <group ref={groupRef}>
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
            <DevicePhone screenTexture={project.screenshot} color={DEVICE_COLOR} />
          ) : (
            <DeviceLaptop screenTexture={project.screenshot} color={DEVICE_COLOR} scale={laptopScale} />
          )}
        </group>
      ))}
    </group>
  );
}
