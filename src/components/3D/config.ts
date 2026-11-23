/**
 * Limites e cores da cena 3D do portfólio (spec 0007). Tudo que é número
 * mágico da cena mora aqui, não nos componentes.
 */
import { accent, colors, type ThemeMode } from "~/styles/tokens";

/** Grafite do vidro/moldura dos aparelhos (igual ao handoff, nos dois temas) */
export const BEZEL = "#0D0D0C";

export interface DevicePalette {
  /** Alumínio anodizado da carcaça */
  body: string;
  /** Aro/laterais polidos */
  frame: string;
  /** Teclas e detalhes escuros */
  keys: string;
  /** Poço do teclado e trackpad */
  deck: string;
}

/** Alumínio prata no tema claro, grafite no escuro (hex dos tokens) */
export const DEVICE_PALETTE: Record<ThemeMode, DevicePalette> = {
  light: {
    body: colors.light.line,
    frame: "#B9B6AF",
    keys: colors.dark.card,
    deck: "#D3D0CA",
  },
  /* Grafite mais claro que o fundo (#141413), senão o aparelho some no palco */
  dark: {
    body: "#5A5853",
    frame: "#8A877F",
    keys: colors.dark.bg,
    deck: colors.contact.border,
  },
};

/** LED da câmera: único emissivo forte da cena, é ele que o bloom pega */
export const LED_COLOR = accent;
export const LED_INTENSITY = 6;

interface LightRig {
  /** Intensidade do ambiente de estúdio (Lightformers) */
  environment: number;
  /** Key light direcional (dá a sombra própria e o brilho do metal) */
  key: number;
  /** Opacidade da sombra de contato no piso */
  shadowOpacity: number;
}

export const LIGHTS: Record<ThemeMode, LightRig> = {
  light: { environment: 1.15, key: 1.4, shadowOpacity: 0.35 },
  dark: { environment: 1.2, key: 1.3, shadowOpacity: 0.65 },
};

/**
 * Ângulo da dobradiça do notebook (rotação em x da tampa, em radianos):
 * aberta inclina um pouco para trás; fechada deita sobre o teclado.
 * O plano 07 anima de LID_CLOSED para LID_OPEN na entrada.
 */
export const LID_OPEN = -0.3;
export const LID_CLOSED = Math.PI / 2;

/** Altura do "piso" (sombra de contato), logo abaixo dos aparelhos */
export const FLOOR_Y = -1.45;

/** Câmera um pouco acima, olhando para o centro: mostra o teclado do notebook */
export const CAMERA_POSITION: [number, number, number] = [0, 1.1, 8.4];
/** Para onde a câmera olha: um pouco abaixo do centro, para a base dos aparelhos não cortar na borda do palco */
export const CAMERA_TARGET: [number, number, number] = [0, -0.35, 0];
export const CAMERA_FOV = 42;

/* ---------- Movimento (spec 0007 §2.3–2.8) ---------- */

/** Arraste: radianos de giro por pixel */
export const DRAG_SENSITIVITY = 0.008;
/** O gesto só vira giro depois de andar isso na horizontal… */
export const DRAG_START_PX = 10;
/** …e se ficar até este ângulo da horizontal; senão é rolagem da página */
export const DRAG_MAX_ANGLE = 30;
/** Gesto que andou menos que isso é clique no aparelho */
export const CLICK_MAX_PX = 6;
/** Janela de amostras para medir a velocidade ao soltar (ms) */
export const VELOCITY_WINDOW_MS = 100;
/** Desaceleração da inércia (1/s): maior = para mais rápido */
export const INERTIA_FRICTION = 4;
/** Abaixo desta velocidade (rad/s) a inércia acaba e o carrossel encaixa */
export const SNAP_VELOCITY = 0.9;
/** Duração do encaixe final e da troca por botão/dot/teclado (s) */
export const SNAP_DURATION = 0.55;
export const SELECT_DURATION = 0.8;

/** Inclinação máxima da cena seguindo o cursor (graus) e amortecimento */
export const PARALLAX_MAX_DEG = 4;
export const PARALLAX_DAMPING = 0.06;
/** Flutuação do aparelho ativo: amplitude (unidades) e velocidade */
export const FLOAT_AMPLITUDE = 0.04;
export const FLOAT_SPEED = 1.2;

/** Entrada ao rolar: duração total, atraso entre aparelhos e chave da sessão */
export const ENTRANCE_DURATION = 1.2;
export const ENTRANCE_STAGGER = 0.12;
export const ENTRANCE_RISE = 1.4;
export const ENTRANCE_SESSION_KEY = "prma:carousel-entrance";

/* ---------- Desempenho (spec 0007 §2, casos de borda) ---------- */

/** Abaixo disso por FPS_WINDOW_MS, a qualidade cai um nível */
export const FPS_MIN = 45;
/** Acima disso por FPS_WINDOW_MS, a qualidade volta um nível */
export const FPS_RECOVER = 58;
/** Janela de medição: 10 amostras de 200ms */
export const FPS_SAMPLE_MS = 200;
export const FPS_SAMPLES = 10;
/** Trocas de nível por visita; depois disso, fica onde está */
export const MAX_QUALITY_SWITCHES = 3;

/**
 * Níveis de qualidade, do melhor para o mais leve:
 * 0 tudo ligado · 1 sem pós-processamento · 2 sem sombra · 3 DPR 1.
 */
export const QUALITY_LEVELS = 3;

/** DPR máximo por tipo de ponteiro (fino = mouse/trackpad) */
export const DPR_MAX = { fine: 1.75, coarse: 1.5 } as const;

/** Tamanho da sombra no piso (largura, profundidade) por aparelho */
export const SHADOW_SIZE = { web: [3.2, 2.2], mobile: [1.7, 0.7] } as const;

/* ---------- Pós-processamento ---------- */

/**
 * Bloom só no que passa de 1 em luminância: o LED (emissivo forte) e
 * reflexos fortes do metal. A tela (meshBasicMaterial, toneMapped=false)
 * fica em no máximo 1 e não brilha, nem com screenshot clara.
 */
export const BLOOM = { threshold: 1.1, intensity: 0.6, radius: 0.6 } as const;
