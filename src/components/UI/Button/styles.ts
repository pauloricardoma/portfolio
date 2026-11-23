import styled, { css } from "styled-components";
import { borderRadius } from "~/styles/tokens";
import type { ButtonVariant } from "./Button";

interface StyledButtonProps {
  $variant: ButtonVariant;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 22px;
  border-radius: ${borderRadius.button}px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          font-weight: 600;
          border: none;
          background: ${({ theme }) => theme.colors.accent};
          color: ${({ theme }) => theme.colors.onAccent};

          &:hover {
            filter: brightness(1.06);
          }
        `
      : css`
          font-weight: 500;
          border: 1px solid ${({ theme }) => theme.colors.line};
          background: transparent;
          color: inherit;

          &:hover {
            border-color: ${({ theme }) => theme.colors.accent};
          }
        `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
