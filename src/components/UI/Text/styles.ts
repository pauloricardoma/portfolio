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
