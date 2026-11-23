/**
 * ProjectsCarousel.tsx — Carrossel orbital 3D dos projetos.
 *
 * CONCEITOS CHAVE:
 *
 * 1. POSIÇÃO EM CÍRCULO: o aparelho `i` fica no ângulo i × passo + ângulo do
 *    carrossel; x = raio × sin, z = raio × cos. Mais perto da câmera = maior.
 *
 * 2. CONTROLADO DE FORA: o projeto ativo (`activeIndex`) mora no
 *    usePortfolio. A cena pede trocas com `onSelect(index, source)` e reage ao
 *    `activeIndex`. "O último comando vence": um `activeIndex` novo vindo de
 *    fora cancela inércia ou encaixe em curso e gira para ele.
 *
 * 3. MÁQUINA DE ESTADOS DO GIRO (phaseRef):
 *    idle  → parado ou animando com GSAP até um alvo;
 *    drag  → o alvo segue o dedo/mouse;
 *    coast → solto com velocidade: inércia (carouselMath.inertiaStep) até a
 *            velocidade cair, e aí encaixa no aparelho mais perto.
 *    O ângulo desenhado persegue o alvo com amortecimento (sem saltos).
 *
 * 4. GESTO: pointer events no <canvas> com `touch-action: pan-y`. O gesto só
 *    vira giro se for quase horizontal (classifyGesture); vertical é rolagem
 *    da página e o carrossel ignora. Nada de preventDefault.
 *
 * 5. ENTRADA (uma vez por sessão): quando o palco aparece, os aparelhos sobem
 *    escalonados e a tampa do notebook abre.
 *
 * 6. PARALLAX (só mouse) e FLUTUAÇÃO do ativo. Com reduced motion, nada disso:
 *    trocas e encaixes são instantâneos.
 *
 * Toda a matemática está em carouselMath.ts (testada com Vitest).
 */
import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { Group, Mesh } from "three";
import type { IProject } from "~/interfaces/portfolio/IProject";
import DevicePhone from "~/components/3D/DevicePhone";
import DeviceLaptop from "~/components/3D/DeviceLaptop";
import FloorShadow from "~/components/3D/FloorShadow";
import {
  CLICK_MAX_PX,
  DRAG_MAX_ANGLE,
  DRAG_SENSITIVITY,
  DRAG_START_PX,
  ENTRANCE_DURATION,
  ENTRANCE_RISE,
  ENTRANCE_SESSION_KEY,
  ENTRANCE_STAGGER,
  FLOAT_AMPLITUDE,
  FLOAT_SPEED,
  FLOOR_Y,
  INERTIA_FRICTION,
  LID_CLOSED,
  LID_OPEN,
  PARALLAX_DAMPING,
  PARALLAX_MAX_DEG,
  SELECT_DURATION,
  SHADOW_SIZE,
  SNAP_DURATION,
  SNAP_VELOCITY,
  VELOCITY_WINDOW_MS,
  type DevicePalette,
} from "~/components/3D/config";
import {
  angleForIndex,
  classifyGesture,
  inertiaStep,
  shortestDelta,
  snapTarget,
  velocityFromSamples,
  type AngleSample,
  type SelectSource,
} from "~/components/3D/carouselMath";

const TWO_PI = Math.PI * 2;
const PARALLAX_MAX_RAD = (PARALLAX_MAX_DEG * Math.PI) / 180;

interface ProjectsCarouselProps {
  projects: IProject[];
  activeIndex: number;
  /** Pede a troca de projeto (o estado fica fora da cena) */
  onSelect: (index: number, source: SelectSource) => void;
  /** Cores dos aparelhos em hex, por tema (Three.js não lê var(--…)) */
  palette: DevicePalette;
  /** Raio do círculo orbital: maior = aparelhos mais afastados do centro */
  orbitRadius?: number;
  /** Escala do notebook (menor no celular, para não cobrir os de trás) */
  laptopScale?: number;
  /** Escala do celular (menor no palco estreito do celular) */
  phoneScale?: number;
  /** Sem entrada, inércia, parallax nem flutuação; trocas instantâneas */
  reducedMotion?: boolean;
  /** Sombra no piso (desliga no nível 2 de degradação) */
  shadows?: boolean;
  shadowOpacity?: number;
}

type Phase = "idle" | "drag" | "coast";

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  startAngle: number;
  kind: "pending" | "drag";
}

/** A entrada já rodou nesta sessão? (sessionStorage pode não existir) */
function entranceSeen() {
  try {
    return sessionStorage.getItem(ENTRANCE_SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

function markEntranceSeen() {
  try {
    sessionStorage.setItem(ENTRANCE_SESSION_KEY, "1");
  } catch {
    // sem sessionStorage: a entrada pode repetir, sem problema
  }
}

export default function ProjectsCarousel({
  projects,
  activeIndex,
  onSelect,
  palette,
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
  const { gl } = useThree();

  /* ---------- Estado por frame (refs, sem re-render) ---------- */

  /** Ângulo desenhado e o alvo que ele persegue */
  const angleRef = useRef(angleForIndex(activeIndex, count));
  const targetAngleRef = useRef(angleRef.current);
  const phaseRef = useRef<Phase>("idle");
  const velocityRef = useRef(0);
  const samplesRef = useRef<AngleSample[]>([]);
  const gestureRef = useRef<Gesture | null>(null);
  /** Clique logo depois de um arraste não conta */
  const suppressClickRef = useRef(false);
  /** Índice que a própria cena escolheu (não precisa girar de novo) */
  const selfSelectRef = useRef<number | null>(null);
  const activeRef = useRef(activeIndex);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const tiltRef = useRef<Group>(null);
  const pointerRef = useRef({ x: 0, y: 0, inside: false, fine: false });

  const deviceRefs = useRef<(Group | null)[]>([]);
  const shadowRefs = useRef<(Mesh | null)[]>([]);
  const hingeRefs = useRef<(Group | null)[]>([]);

  /** Progresso da entrada por aparelho (0 escondido → 1 no lugar) e da tampa */
  const entranceRef = useRef({ devices: projects.map(() => 1), lid: 1 });

  /* ---------- Giro ---------- */

  /** Anima o alvo até `angle` (instantâneo com reduced motion) */
  const tweenTarget = useCallback((angle: number, duration: number) => {
    gsap.killTweensOf(targetAngleRef);
    phaseRef.current = "idle";
    if (reducedRef.current) {
      targetAngleRef.current = angle;
      angleRef.current = angle;
      return;
    }
    gsap.to(targetAngleRef, { current: angle, duration, ease: "power3.out" });
  }, []);

  /** Gira até o projeto `index` pelo caminho mais curto */
  const rotateTo = useCallback(
    (index: number, duration = SELECT_DURATION) => {
      const from = targetAngleRef.current;
      tweenTarget(from + shortestDelta(from, angleForIndex(index, count)), duration);
    },
    [count, tweenTarget]
  );

  /** Seleção que nasce na cena (arraste/clique) */
  const selectFromScene = useCallback(
    (index: number, source: SelectSource) => {
      selfSelectRef.current = index;
      onSelect(index, source);
    },
    [onSelect]
  );

  /** Encaixa no aparelho mais perto de onde o giro pararia */
  const snap = useCallback(
    (velocity: number) => {
      const target = snapTarget(targetAngleRef.current, velocity, count, INERTIA_FRICTION);
      tweenTarget(target.angle, SNAP_DURATION);
      selectFromScene(target.index, "drag");
    },
    [count, tweenTarget, selectFromScene]
  );

  /** activeIndex vindo de fora: o último comando vence */
  useEffect(() => {
    activeRef.current = activeIndex;
    if (selfSelectRef.current === activeIndex) {
      selfSelectRef.current = null;
      return;
    }
    selfSelectRef.current = null;
    rotateTo(activeIndex);
  }, [activeIndex, rotateTo]);

  useEffect(
    () => () => {
      gsap.killTweensOf(targetAngleRef);
    },
    []
  );

  /* ---------- Entrada ao rolar (uma vez por sessão) ---------- */

  useEffect(() => {
    const entrance = entranceRef.current;
    if (reducedMotion || entranceSeen()) {
      entrance.devices.fill(1);
      entrance.lid = 1;
      return;
    }

    entrance.devices.fill(0);
    entrance.lid = 0;
    let timeline: gsap.core.Timeline | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        markEntranceSeen();

        const rise = ENTRANCE_DURATION * 0.7;
        timeline = gsap.timeline();
        entrance.devices.forEach((_, i) => {
          timeline!.to(entrance.devices, { [i]: 1, duration: rise, ease: "power3.out" }, i * ENTRANCE_STAGGER);
        });
        timeline.to(
          entrance,
          { lid: 1, duration: ENTRANCE_DURATION - rise * 0.5, ease: "power2.inOut" },
          rise * 0.5
        );
      },
      { threshold: 0.35 }
    );
    observer.observe(gl.domElement);

    return () => {
      observer.disconnect();
      timeline?.progress(1).kill();
    };
  }, [gl, reducedMotion]);

  /* ---------- Gestos no canvas ---------- */

  useEffect(() => {
    const canvas = gl.domElement;
    const pointer = pointerRef.current;
    pointer.fine = window.matchMedia("(pointer: fine)").matches;

    const updateParallax = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.inside = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      gestureRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startAngle: targetAngleRef.current,
        kind: "pending",
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateParallax(e);
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== e.pointerId) return;

      const dx = e.clientX - gesture.startX;
      const dy = e.clientY - gesture.startY;

      if (gesture.kind === "pending") {
        const kind = classifyGesture(dx, dy, { startPx: DRAG_START_PX, maxAngleDeg: DRAG_MAX_ANGLE });
        if (kind === "pending") return;
        if (kind === "scroll") {
          // Rolagem da página: o carrossel sai do caminho
          gestureRef.current = null;
          return;
        }
        // Virou arraste: pega o carrossel onde ele estiver (cancela inércia/encaixe)
        gesture.kind = "drag";
        gsap.killTweensOf(targetAngleRef);
        gesture.startAngle = targetAngleRef.current;
        gesture.startX = e.clientX;
        phaseRef.current = "drag";
        samplesRef.current = [];
        canvas.setPointerCapture(e.pointerId);
      }

      targetAngleRef.current = gesture.startAngle + (e.clientX - gesture.startX) * DRAG_SENSITIVITY;
      const samples = samplesRef.current;
      samples.push({ t: e.timeStamp, angle: targetAngleRef.current });
      while (samples.length > 2 && e.timeStamp - samples[0].t > VELOCITY_WINDOW_MS) samples.shift();
    };

    const handlePointerEnd = (e: PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== e.pointerId) return;
      gestureRef.current = null;
      if (gesture.kind !== "drag") return;

      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);

      // Amostras velhas (o dedo parou antes de soltar) não contam
      const recent = samplesRef.current.filter((s) => e.timeStamp - s.t <= VELOCITY_WINDOW_MS);
      const velocity = reducedRef.current ? 0 : velocityFromSamples(recent);

      if (Math.abs(velocity) < SNAP_VELOCITY) {
        snap(0);
      } else {
        velocityRef.current = velocity;
        phaseRef.current = "coast";
      }
    };

    const handlePointerLeave = () => {
      pointer.inside = false;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerEnd);
    canvas.addEventListener("pointercancel", handlePointerEnd);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    // Vertical fica com o navegador (rolagem); horizontal chega como pointermove
    canvas.style.touchAction = "pan-y";

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerEnd);
      canvas.removeEventListener("pointercancel", handlePointerEnd);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.style.touchAction = "";
    };
  }, [gl, snap]);

  /* ---------- Frame ---------- */

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const reduced = reducedRef.current;

    // Inércia: desacelera e, abaixo do limite, encaixa
    if (phaseRef.current === "coast") {
      const next = inertiaStep(targetAngleRef.current, velocityRef.current, dt, INERTIA_FRICTION);
      targetAngleRef.current = next.angle;
      velocityRef.current = next.velocity;
      if (Math.abs(next.velocity) < SNAP_VELOCITY) snap(next.velocity);
    }

    // O ângulo desenhado persegue o alvo (mais colado durante o arraste)
    const follow = phaseRef.current === "drag" ? 22 : 7;
    angleRef.current = reduced
      ? targetAngleRef.current
      : angleRef.current + (targetAngleRef.current - angleRef.current) * (1 - Math.exp(-follow * dt));

    // Parallax: inclina o conjunto seguindo o mouse
    const tilt = tiltRef.current;
    if (tilt) {
      const pointer = pointerRef.current;
      const on = pointer.fine && pointer.inside && !reduced;
      const k = 1 - Math.pow(1 - PARALLAX_DAMPING, dt * 60);
      tilt.rotation.y += ((on ? pointer.x * PARALLAX_MAX_RAD : 0) - tilt.rotation.y) * k;
      tilt.rotation.x += ((on ? pointer.y * PARALLAX_MAX_RAD * 0.6 : 0) - tilt.rotation.x) * k;
    }

    const entrance = entranceRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const device = deviceRefs.current[i];
      if (!device) continue;

      const itemAngle = i * anglePerItem + angleRef.current;
      const x = Math.sin(itemAngle) * radius;
      const z = Math.cos(itemAngle) * radius;
      /** z vai de -raio (atrás) a +raio (frente) → escala de 0.6 a 1.1 */
      const depthScale = 0.6 + ((z + radius) / (radius * 2)) * 0.5;
      const appear = entrance.devices[i];
      const float = !reduced && i === activeRef.current ? Math.sin(time * FLOAT_SPEED) * FLOAT_AMPLITUDE : 0;

      device.visible = appear > 0.001;
      device.position.set(x, -(1 - appear) * ENTRANCE_RISE + float, z);
      device.scale.setScalar(depthScale * (0.7 + 0.3 * appear));
      /** De frente para a câmera quando está na posição frontal */
      device.rotation.y = -itemAngle;

      /** A sombra acompanha no piso (o plano está deitado: girar em z = girar no piso) */
      const shadow = shadowRefs.current[i];
      if (shadow) {
        shadow.visible = device.visible;
        shadow.position.set(x, FLOOR_Y, z);
        shadow.scale.setScalar(depthScale * appear);
        shadow.rotation.z = -itemAngle;
      }

      const hinge = hingeRefs.current[i];
      if (hinge) hinge.rotation.x = LID_CLOSED + (LID_OPEN - LID_CLOSED) * entrance.lid;
    }
  });

  return (
    <group ref={tiltRef}>
      {projects.map((project, index) => (
        <group
          key={project.id}
          ref={(el) => {
            deviceRefs.current[index] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
            /** Fim de um arraste não é clique */
            if (suppressClickRef.current || e.delta >= CLICK_MAX_PX) return;
            if (index === activeRef.current) {
              // Já é o ativo: só recentraliza se o giro parou no meio
              rotateTo(index);
              return;
            }
            selectFromScene(index, "click");
            rotateTo(index);
          }}
        >
          {project.type === "mobile" ? (
            <DevicePhone screenTexture={project.screenshot} palette={palette} scale={phoneScale} />
          ) : (
            <DeviceLaptop
              screenTexture={project.screenshot}
              palette={palette}
              scale={laptopScale}
              hingeRef={(el) => {
                hingeRefs.current[index] = el;
              }}
            />
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
