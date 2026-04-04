/**
 * Section/styles.ts — Wrapper de seção.
 *
 * Cada seção do portfólio (Hero, Projetos, Skills, Contato) é envolvida
 * por esse componente que aplica padding vertical consistente.
 *
 * $fullHeight: quando true, faz a seção ocupar 100vh (tela inteira).
 * Útil pro Hero.
 */
import styled from "styled-components";
import { spacing } from "~/styles/tokens";

interface StyledSectionProps {
  $fullHeight?: boolean;
}

export const StyledSection = styled.section<StyledSectionProps>`
  width: 100%;
  min-height: ${({ $fullHeight }) => ($fullHeight ? "100vh" : "auto")};
  padding: ${spacing.xxxl}px 0;

  ${({ $fullHeight }) =>
    $fullHeight &&
    `
    display: flex;
    align-items: center;
    padding: 0;
  `}
`;
