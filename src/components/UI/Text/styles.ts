/**
 * Text/styles.ts — Estilos do componente de tipografia.
 *
 * Em vez de usar a prop "as" do styled-components (que tem problemas
 * de tipagem com generics), exportamos os estilos como CSS puro
 * e o componente Text.tsx renderiza a tag HTML correta diretamente.
 *
 * As variantes controlam font-size, font-weight e line-height
 * usando os tokens que definimos em tokens.ts.
 */
import { fontSize, fontWeight, lineHeight } from "~/styles/tokens";

export type TextVariant =
  | "hero"
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "bodySmall"
  | "caption";

/**
 * Mapa de estilos por variante.
 * Cada variante define size, weight e lineHeight.
 * "hero" e "display" são pra títulos grandes com impacto visual.
 */
export const variantStyles: Record<
  TextVariant,
  { size: number; weight: number; lh: number }
> = {
  hero: { size: fontSize.hero, weight: fontWeight.bold, lh: lineHeight.tight },
  display: { size: fontSize.display, weight: fontWeight.bold, lh: lineHeight.tight },
  h1: { size: fontSize.xxl, weight: fontWeight.bold, lh: lineHeight.tight },
  h2: { size: fontSize.xl, weight: fontWeight.semibold, lh: lineHeight.tight },
  h3: { size: fontSize.lg, weight: fontWeight.semibold, lh: lineHeight.tight },
  h4: { size: fontSize.md, weight: fontWeight.semibold, lh: lineHeight.normal },
  body: { size: fontSize.md, weight: fontWeight.regular, lh: lineHeight.normal },
  bodySmall: { size: fontSize.sm, weight: fontWeight.regular, lh: lineHeight.normal },
  caption: { size: fontSize.xs, weight: fontWeight.regular, lh: lineHeight.normal },
};

/** Mapa: variante → tag HTML semântica */
export const variantTag: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  hero: "h1",
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  bodySmall: "p",
  caption: "span",
};
