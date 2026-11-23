import { describe, expect, it } from "vitest";
import {
  angleForIndex,
  classifyGesture,
  indexForAngle,
  inertiaStep,
  isClick,
  normalizeIndex,
  shortestDelta,
  snapTarget,
  velocityFromSamples,
} from "./carouselMath";

const TWO_PI = Math.PI * 2;
const STEP_3 = TWO_PI / 3;

describe("normalizeIndex", () => {
  it("mantém índices válidos", () => {
    expect(normalizeIndex(0, 3)).toBe(0);
    expect(normalizeIndex(2, 3)).toBe(2);
  });

  it("dá a volta para frente e para trás (loop)", () => {
    expect(normalizeIndex(3, 3)).toBe(0);
    expect(normalizeIndex(7, 3)).toBe(1);
    expect(normalizeIndex(-1, 3)).toBe(2);
    expect(normalizeIndex(-4, 3)).toBe(2);
  });
});

describe("ângulo ↔ índice", () => {
  it("índice 0 fica de frente (ângulo 0) e os outros giram no sentido negativo", () => {
    expect(angleForIndex(0, 3)).toBeCloseTo(0);
    expect(angleForIndex(1, 3)).toBeCloseTo(-STEP_3);
  });

  it("ida e volta são inversas", () => {
    for (let i = 0; i < 5; i++) expect(indexForAngle(angleForIndex(i, 5), 5)).toBe(i);
  });

  it("arredonda para o aparelho mais perto da frente", () => {
    expect(indexForAngle(-STEP_3 * 0.4, 3)).toBe(0);
    expect(indexForAngle(-STEP_3 * 0.6, 3)).toBe(1);
  });

  it("funciona com ângulo grande e positivo (várias voltas)", () => {
    expect(indexForAngle(TWO_PI * 5 + STEP_3, 3)).toBe(2);
    expect(indexForAngle(-TWO_PI * 7 - STEP_3, 3)).toBe(1);
  });
});

describe("shortestDelta", () => {
  it("fica em [-π, π)", () => {
    for (const [from, to] of [
      [0, 3],
      [0, -3],
      [10, -10],
      [-25, 40],
    ]) {
      const delta = shortestDelta(from, to);
      expect(delta).toBeGreaterThanOrEqual(-Math.PI);
      expect(delta).toBeLessThan(Math.PI);
      // from + delta aponta para o mesmo lugar que `to`
      expect(Math.cos(from + delta)).toBeCloseTo(Math.cos(to));
      expect(Math.sin(from + delta)).toBeCloseTo(Math.sin(to));
    }
  });

  it("prefere o caminho curto com ângulo negativo (bug antigo do %)", () => {
    expect(shortestDelta(-0.1, -TWO_PI + 0.1)).toBeCloseTo(0.2);
  });
});

describe("inertiaStep", () => {
  it("velocidade zero não mexe", () => {
    const next = inertiaStep(1.5, 0, 1 / 60, 4);
    expect(next.angle).toBe(1.5);
    expect(next.velocity).toBe(0);
  });

  it("desacelera e anda no sentido da velocidade", () => {
    const next = inertiaStep(0, 3, 1 / 60, 4);
    expect(next.angle).toBeGreaterThan(0);
    expect(next.velocity).toBeLessThan(3);
    expect(next.velocity).toBeGreaterThan(0);
  });

  it("não depende da taxa de quadros: 60 passos de 1/60s = 1 passo de 1s", () => {
    let state = { angle: 0, velocity: 2 };
    for (let i = 0; i < 60; i++) state = inertiaStep(state.angle, state.velocity, 1 / 60, 4);
    const once = inertiaStep(0, 2, 1, 4);
    expect(state.angle).toBeCloseTo(once.angle, 6);
    expect(state.velocity).toBeCloseTo(once.velocity, 6);
  });
});

describe("snapTarget", () => {
  it("sem velocidade, encaixa no mais perto", () => {
    const snap = snapTarget(-STEP_3 * 0.3, 0, 3, 4);
    expect(snap.index).toBe(0);
    expect(snap.angle).toBeCloseTo(0);
  });

  it("com velocidade, encaixa onde a inércia pararia", () => {
    // parado em 0, girando para o negativo com força: passa do 1 e para no 2
    const snap = snapTarget(0, -4 * STEP_3 * 1.8, 3, 4);
    expect(snap.index).toBe(2);
  });

  it("o ângulo de encaixe fica perto de onde a inércia leva (não dá volta extra)", () => {
    const snap = snapTarget(TWO_PI * 3, 0, 3, 4);
    expect(snap.angle).toBeCloseTo(TWO_PI * 3);
    expect(snap.index).toBe(0);
  });
});

describe("velocityFromSamples", () => {
  it("sem amostras suficientes, zero", () => {
    expect(velocityFromSamples([])).toBe(0);
    expect(velocityFromSamples([{ t: 0, angle: 1 }])).toBe(0);
  });

  it("radianos por segundo entre a primeira e a última amostra", () => {
    expect(
      velocityFromSamples([
        { t: 1000, angle: 0 },
        { t: 1050, angle: 0.1 },
        { t: 1100, angle: 0.2 },
      ])
    ).toBeCloseTo(2);
  });
});

describe("classifyGesture", () => {
  const limits = { startPx: 10, maxAngleDeg: 30 };

  it("movimento curto ainda não decidiu", () => {
    expect(classifyGesture(4, 3, limits)).toBe("pending");
  });

  it("horizontal vira arraste", () => {
    expect(classifyGesture(-15, 2, limits)).toBe("drag");
  });

  it("vertical vira rolagem da página", () => {
    expect(classifyGesture(2, 15, limits)).toBe("scroll");
  });

  it("diagonal acima do ângulo máximo é rolagem", () => {
    // 45° da horizontal
    expect(classifyGesture(12, 12, limits)).toBe("scroll");
    // ~22° da horizontal
    expect(classifyGesture(20, 8, limits)).toBe("drag");
  });
});

describe("isClick", () => {
  it("abaixo do limite é clique; a partir dele é arraste", () => {
    expect(isClick(5, 6)).toBe(true);
    expect(isClick(6, 6)).toBe(false);
  });
});
