import styled from "styled-components";
import { spacing, borderRadius, breakpoints } from "~/styles/tokens";

/**
 * ProjectsSectionWrapper — CLS fix: filhos animados com gsap.from({ opacity: 0 })
 * começam invisíveis no CSS pra evitar flash visível → invisível → animado.
 */
export const ProjectsSectionWrapper = styled.div`
  width: 100%;
  position: relative;

  .projects-title,
  .projects-canvas,
  .projects-info {
    visibility: hidden;
  }
`;

/** Container do Canvas 3D — precisa de altura fixa */
export const CanvasContainer = styled.div`
  width: 100%;
  height: 500px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    height: 600px;
  }
`;

/** Card de descrição do projeto em foco */
export const DescriptionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
  padding: ${spacing.lg}px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  transition: all 0.3s ease;
`;

export const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm}px;
  justify-content: center;
  margin-top: ${spacing.md}px;
`;

export const TechTag = styled.span`
  font-size: 12px;
  padding: ${spacing.xs}px ${spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
  color: ${({ theme }) => theme.colors.primary.primary};
  border-radius: ${borderRadius.full}px;
  font-weight: 500;
`;

/** Navegação por dots (bolinhas) */
export const DotsNav = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm}px;
  margin-top: ${spacing.lg}px;
`;

interface DotProps {
  $active: boolean;
}

export const Dot = styled.button<DotProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.primary : theme.colors.surface.surfaceOutline};
  transform: ${({ $active }) => ($active ? "scale(1.3)" : "scale(1)")};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.primary};
  }
`;

/** Setas de navegação */
export const NavArrows = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.lg}px;
  margin-top: ${spacing.md}px;
`;

export const NavArrow = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  color: ${({ theme }) => theme.colors.surface.onSurface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
    border-color: ${({ theme }) => theme.colors.primary.primary};
    color: ${({ theme }) => theme.colors.primary.primary};
  }
`;

/**
 * ProjectsFallback — Placeholder com altura igual ao ProjectsSection renderizado.
 *
 * Usado como Suspense fallback enquanto o chunk do Three.js carrega.
 * As alturas espelham: Section padding (64*2) + título (~70) + Canvas (500/600)
 * + description card (~150) + dots (~34) + arrows (~56) = ~938 mobile, ~1038 tablet.
 *
 * Não precisa ser pixel-perfect — o objetivo é minimizar o delta
 * entre fallback e conteúdo real pra reduzir CLS.
 */
export const ProjectsFallback = styled.div`
  min-height: 938px;

  @media (min-width: ${breakpoints.tablet}px) {
    min-height: 1038px;
  }
`;
