/**
 * carouselMath.ts — Matemática pura do carrossel (sem Three.js nem React).
 *
 * Convenção: o carrossel tem um ângulo; o aparelho `i` fica de frente quando
 * o ângulo é `-i × passo` (passo = 2π / n). Ângulos não são normalizados
 * (podem ter várias voltas), para o giro ser contínuo.
 */

const TWO_PI = Math.PI * 2;

/** Quem pediu a troca de projeto de dentro da cena */
export type SelectSource = "drag" | "click";

/** Qualquer inteiro vira um índice válido (loop módulo n) */
export function normalizeIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

/** Ângulo do carrossel que deixa `index` de frente */
export function angleForIndex(index: number, count: number) {
  return (-index * TWO_PI) / count;
}

/** Índice do aparelho mais perto da frente para um ângulo */
export function indexForAngle(angle: number, count: number) {
  return normalizeIndex(Math.round((-angle * count) / TWO_PI), count);
}

/** Diferença angular em [-π, π): o giro mais curto de `from` até `to` */
export function shortestDelta(from: number, to: number) {
  const diff = (to - from) % TWO_PI;
  return ((diff + 3 * Math.PI) % TWO_PI) - Math.PI;
}

/**
 * Um passo da inércia com desaceleração exponencial: v(t) = v₀·e^(−k·t).
 * Integrado de forma exata, então o resultado não depende da taxa de quadros.
 * `friction` (k) em 1/s: maior para mais rápido.
 */
export function inertiaStep(angle: number, velocity: number, dt: number, friction: number) {
  if (velocity === 0) return { angle, velocity };
  const decay = Math.exp(-friction * dt);
  return {
    angle: angle + (velocity * (1 - decay)) / friction,
    velocity: velocity * decay,
  };
}

/**
 * Onde encaixar ao soltar: projeta onde a inércia pararia (v / k), escolhe o
 * aparelho mais perto desse ponto e devolve o ângulo dele na volta certa.
 */
export function snapTarget(angle: number, velocity: number, count: number, friction: number) {
  const rest = angle + velocity / friction;
  const index = indexForAngle(rest, count);
  return { index, angle: rest + shortestDelta(rest, angleForIndex(index, count)) };
}

export interface AngleSample {
  /** ms */
  t: number;
  angle: number;
}

/** Velocidade em rad/s entre a primeira e a última amostra recente do arraste */
export function velocityFromSamples(samples: AngleSample[]) {
  if (samples.length < 2) return 0;
  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = (last.t - first.t) / 1000;
  return dt > 0 ? (last.angle - first.angle) / dt : 0;
}

export type GestureKind = "pending" | "drag" | "scroll";

/**
 * Decide o que um gesto de toque/mouse é. Abaixo de `startPx` nos dois eixos,
 * ainda não dá para saber; depois, vira arraste se for quase horizontal
 * (até `maxAngleDeg` da horizontal) e rolagem da página se não for.
 */
export function classifyGesture(
  dx: number,
  dy: number,
  limits: { startPx: number; maxAngleDeg: number }
): GestureKind {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < limits.startPx && ay < limits.startPx) return "pending";
  const angle = (Math.atan2(ay, ax) * 180) / Math.PI;
  return ax >= limits.startPx && angle <= limits.maxAngleDeg ? "drag" : "scroll";
}

/** Um gesto que andou menos que `maxPx` é clique */
export function isClick(distancePx: number, maxPx: number) {
  return distancePx < maxPx;
}
