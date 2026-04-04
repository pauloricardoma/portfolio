/**
 * Header/styles.ts
 *
 * O Header usa backdrop-filter: blur() — isso faz o fundo ficar
 * "embaçado" (glassmorphism). O conteúdo atrás do header fica
 * visível mas desfocado, dando um visual moderno.
 *
 * O header é position: fixed — sempre visível no topo.
 * z-index: 100 — fica acima de todo o conteúdo (incluindo o Canvas 3D).
 */
import styled, { css } from "styled-components";
import { spacing, breakpoints, borderRadius } from "~/styles/tokens";

interface HeaderWrapperProps {
  $visible: boolean;
}

export const HeaderWrapper = styled.header<HeaderWrapperProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${spacing.md}px 0;
  background-color: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.surface.surface} 80%, transparent)`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${({ $visible }) =>
    !$visible &&
    css`
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
    `}
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.a`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.primary};
  text-decoration: none;
  letter-spacing: -0.5px;
`;

/** Nav links — escondidos no mobile */
export const NavLinks = styled.nav`
  display: none;
  gap: ${spacing.lg}px;

  @media (min-width: ${breakpoints.tablet}px) {
    display: flex;
  }
`;

export const NavLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.primary};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
`;

/**
 * Toggle de tema — botão circular que alterna entre sol (light) e lua (dark).
 */
export const ThemeToggle = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.surface.onSurface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
    border-color: ${({ theme }) => theme.colors.primary.primaryOutline};
  }
`;

/** Hamburger — visível apenas no mobile */
export const HamburgerButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${borderRadius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.surface.onSurface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  @media (min-width: ${breakpoints.tablet}px) {
    display: none;
  }
`;

/** Menu mobile — slide down */
interface MobileMenuProps {
  $open: boolean;
}

export const MobileMenu = styled.div<MobileMenuProps>`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.surface.surface} 95%, transparent)`};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  padding: ${spacing.lg}px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  z-index: 99;
  transition: transform 0.3s ease, opacity 0.3s ease;

  ${({ $open }) =>
    !$open &&
    css`
      transform: translateY(-20px);
      opacity: 0;
      pointer-events: none;
    `}

  @media (min-width: ${breakpoints.tablet}px) {
    display: none;
  }
`;

export const MobileNavLink = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.surface.onSurface};
  text-decoration: none;
  padding: ${spacing.sm}px 0;
  text-align: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.primary};
  }
`;
