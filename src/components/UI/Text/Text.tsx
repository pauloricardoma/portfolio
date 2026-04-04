/**
 * Text.tsx — Componente de tipografia.
 *
 * Renderiza texto com a tag HTML semântica correta baseada na variante.
 * Isso é importante pra acessibilidade e SEO:
 * - h1-h4 usam as tags <h1>-<h4> (headings reais)
 * - body/bodySmall usam <p> (parágrafo)
 * - caption usa <span> (inline)
 *
 * Em vez de usar styled-components com prop "as" (que causa conflitos
 * de tipagem), usamos createElement do React pra renderizar a tag certa
 * e aplicamos os estilos inline calculados a partir dos tokens.
 *
 * styled-components ainda é usado via className (se passado pelo pai),
 * mas o estilo base vem dos tokens — isso é mais performático e type-safe.
 */
import { createElement, type ReactNode } from "react";
import { useTheme } from "styled-components";
import { fontWeight as fontWeightTokens } from "~/styles/tokens";
import { variantStyles, variantTag, type TextVariant } from "./styles";

interface TextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof fontWeightTokens;
  align?: "left" | "center" | "right";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Text({
  variant = "body",
  color,
  weight,
  align,
  children,
  className,
  style: externalStyle,
}: TextProps) {
  const theme = useTheme();
  const styles = variantStyles[variant];
  const tag = variantTag[variant];

  const computedStyle: React.CSSProperties = {
    fontSize: styles.size,
    fontWeight: weight ? fontWeightTokens[weight] : styles.weight,
    lineHeight: styles.lh,
    color: color || theme.colors.surface.onSurface,
    textAlign: align || undefined,
    margin: 0,
    ...externalStyle,
  };

  return createElement(tag, { className, style: computedStyle }, children);
}
