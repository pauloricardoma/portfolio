import styled, { css } from "styled-components";
import { Link } from "react-router";
import { borderRadius } from "~/styles/tokens";

export const ToggleWrapper = styled.nav`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 3px;
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.full}px;
`;

export const ToggleLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 10px;
  border-radius: ${borderRadius.full}px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.primary};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background-color: ${theme.colors.primary.primaryContainer};
      color: ${theme.colors.primary.primary};
    `}
`;
