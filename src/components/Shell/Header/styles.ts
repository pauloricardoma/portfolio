import styled, { css } from "styled-components";
import { breakpoints, borderRadius, layout } from "~/styles/tokens";

const navHidden = `(max-width: ${breakpoints.nav - 1}px)`;

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  transition: background-color 0.2s ease;
`;

export const HeaderInner = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: 14px ${layout.gutter}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  @media ${navHidden} {
    gap: 12px;
  }
`;

export const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Wordmark = styled.span`
  font: 600 18px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.03em;
  white-space: nowrap;

  span {
    font-weight: 400;
  }

  @media ${navHidden} {
    font-size: 16px;
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  @media ${navHidden} {
    display: none;
  }
`;

const navLinkStyle = css`
  font: 400 14px ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }

  :root[data-theme="dark"] &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const NavLink = styled.a`
  ${navLinkStyle}
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media ${navHidden} {
    gap: 6px;
  }
`;

const outlineButton = css`
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.md}px;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  font: 500 12px ${({ theme }) => theme.font.mono};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ThemeToggle = styled.button`
  ${outlineButton}
`;

export const MenuButton = styled.button`
  ${outlineButton}
  display: none;

  @media ${navHidden} {
    display: inline-flex;
    align-items: center;
  }
`;

export const MobileMenu = styled.nav<{ $open: boolean }>`
  display: none;

  @media ${navHidden} {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    max-width: ${layout.container}px;
    margin: 0 auto;
    padding: 4px ${layout.gutter}px 16px;
    gap: 4px;
  }
`;

export const MobileNavLink = styled.a`
  ${navLinkStyle}
  font-size: 16px;
  padding: 10px 0;
`;
