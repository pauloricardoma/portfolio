/**
 * Button/styles.ts — Estilos do botão.
 *
 * Usa o helper css`` do styled-components pra aplicar blocos de CSS
 * condicionalmente. Cada variante (primary, secondary, ghost) é um
 * bloco css`` separado, ativado pela prop $variant.
 *
 * Padrão do Coordly: variantes via css`` condicional.
 */
import styled, { css } from "styled-components";
import { fontSize, fontWeight, borderRadius, spacing } from "~/styles/tokens";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
}

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: ${spacing.xs}px ${spacing.md}px;
    font-size: ${fontSize.sm}px;
  `,
  md: css`
    padding: ${spacing.sm}px ${spacing.lg}px;
    font-size: ${fontSize.md}px;
  `,
  lg: css`
    padding: ${spacing.md}px ${spacing.xl}px;
    font-size: ${fontSize.lg}px;
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm}px;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${fontWeight.semibold};
  border-radius: ${borderRadius.md}px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $size }) => sizeStyles[$size]}

  /* Variante Primary — fundo azul, texto branco */
  ${({ $variant }) =>
    $variant === "primary" &&
    css`
      background-color: ${({ theme }) => theme.colors.primary.primary};
      color: ${({ theme }) => theme.colors.primary.onPrimary};

      &:hover {
        background-color: ${({ theme }) => theme.colors.primary.primaryHover};
      }
      &:active {
        background-color: ${({ theme }) => theme.colors.primary.primaryPressed};
      }
    `}

  /* Variante Secondary — fundo cinza claro, texto escuro */
  ${({ $variant }) =>
    $variant === "secondary" &&
    css`
      background-color: ${({ theme }) => theme.colors.secondary.secondary};
      color: ${({ theme }) => theme.colors.secondary.onSecondary};

      &:hover {
        background-color: ${({ theme }) => theme.colors.secondary.secondaryHover};
      }
    `}

  /* Variante Ghost — transparente, só texto com cor primary */
  ${({ $variant }) =>
    $variant === "ghost" &&
    css`
      background-color: transparent;
      color: ${({ theme }) => theme.colors.primary.primary};

      &:hover {
        background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
      }
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
