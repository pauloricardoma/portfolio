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
    color: color || theme.colors.ink,
    textAlign: align || undefined,
    margin: 0,
    ...externalStyle,
  };

  return createElement(tag, { className, style: computedStyle }, children);
}
