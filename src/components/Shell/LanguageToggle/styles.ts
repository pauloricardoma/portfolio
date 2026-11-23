import styled, { css } from "styled-components";
import { Link } from "react-router";
import { borderRadius } from "~/styles/tokens";

export const ToggleWrapper = styled.nav`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.md}px;
  overflow: hidden;
`;

export const ToggleLink = styled(Link)<{ $active: boolean }>`
  padding: 7px 10px;
  font: 500 12px ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.colors.ink};
      color: ${theme.colors.bg};

      &:hover {
        color: ${theme.colors.bg};
      }
    `}
`;
