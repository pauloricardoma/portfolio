import styled from "styled-components";
import { spacing, borderRadius, breakpoints } from "~/styles/tokens";

/**
 * SkillsWrapper — container das skills.
 *
 * PERFORMANCE (CLS fix):
 * .skills-title e .skill-card começam com opacity: 0 no CSS
 * pra sincronizar com gsap.from({ opacity: 0 }).
 * Sem isso, os elementos renderizam visíveis, GSAP esconde,
 * e depois anima de volta → layout shift.
 */
export const SkillsWrapper = styled.div`
  width: 100%;

  .skills-title {
    visibility: hidden;
  }

  .skill-card {
    visibility: hidden;
  }
`;

/** Grid responsivo de categorias — 1 coluna mobile, 2 tablet, 3+ desktop */
export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl}px;
  margin-top: ${spacing.xl}px;

  @media (min-width: ${breakpoints.tablet}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${breakpoints.desktop}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const CategoryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.card}px;
  padding: ${spacing.lg}px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
  margin-bottom: ${spacing.md}px;
  padding-bottom: ${spacing.sm}px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.accentSoft};
`;

export const CategoryIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`;

/** Grid de skills dentro de cada categoria */
export const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm}px;
`;

export const SkillTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${spacing.xs + 2}px ${spacing.md}px;
  background-color: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.md}px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/**
 * Barra de proficiência — largura animada com GSAP.
 * Começa com width: 0 e o GSAP anima até o valor real.
 */
export const ProficiencyBar = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.line};
  border-radius: 2px;
  margin-top: ${spacing.md}px;
  overflow: hidden;
`;

interface ProficiencyFillProps {
  $level: number;
}

export const ProficiencyFill = styled.div<ProficiencyFillProps>`
  height: 100%;
  width: 0%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accent}
  );
  border-radius: 2px;
  transition: width 0.3s ease;
`;
