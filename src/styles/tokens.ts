/**
 * Tokens da identidade PRMA Code (handoff em docs/design_handoff_prma_code_brand_site).
 *
 * As cores de tema chegam aos componentes como variáveis CSS (ver themes/theme.ts).
 * `colors` abaixo guarda os mesmos valores em hex, para o que não lê `var(--…)`:
 * Three.js, interpolação no GSAP e o script de tema.
 */

export type ThemeMode = "light" | "dark";

export const accent = "#E8743B";
export const onAccent = "#141413";

export const colors = {
  light: {
    bg: "#FAFAF8",
    ink: "#141413",
    muted: "#5F5D58",
    line: "#E4E2DD",
    card: "#FFFFFF",
  },
  dark: {
    bg: "#141413",
    ink: "#FAFAF8",
    muted: "#A9A69F",
    line: "#2C2B29",
    card: "#1C1B1A",
  },
  /** Faixa de contato: sempre escura, nos dois temas */
  contact: {
    bg: "#141413",
    ink: "#FAFAF8",
    body: "#C9C6BF",
    label: "#A9A69F",
    border: "#3A3936",
  },
} as const;

export const fonts = {
  sans: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const;

/** Escala tipográfica do handoff */
export const type = {
  heroTitle: "600 clamp(64px, 13vw, 168px)/0.9",
  heroTitlePortfolio: "600 clamp(56px, 10vw, 136px)/0.9",
  heroTracking: "-0.055em",
  h2: "600 44px/1.05",
  h2Tracking: "-0.035em",
  lead: "400 clamp(18px, 2vw, 22px)/1.5",
  body: "400 17px/1.55",
  eyebrow: "500 13px",
  chip: "500 13px",
} as const;

/**
 * Breakpoints — pontos onde o layout muda:
 * - mobile: celulares pequenos
 * - nav: abaixo disso a nav do header recolhe no menu
 * - tablet: tablets e celulares grandes
 * - desktop: notebooks e desktops
 * - wide: monitores largos
 *
 * Uso: @media (min-width: ${breakpoints.tablet}px) { ... }
 */
export const breakpoints = {
  mobile: 480,
  nav: 700,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const layout = {
  container: 1160,
  gutter: 24,
  sectionPadding: 96,
  heroPaddingTop: 120,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  button: 10,
  metric: 12,
  card: 16,
  stage: 20,
  full: 999,
} as const;
