import styled from "styled-components";
import { spacing, borderRadius } from "~/styles/tokens";

export const SectionIntro = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: center;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  margin-top: ${spacing.md}px;
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 520px));
  justify-content: center;
  gap: ${spacing.lg}px;
  margin-top: ${spacing.xl}px;
`;

export const Card = styled.article`
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
  padding: ${spacing.lg}px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.primaryOutline};
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${spacing.sm}px;
  padding-bottom: ${spacing.sm}px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary.primaryContainer};
`;

export const StatusBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: ${spacing.xs}px ${spacing.sm + 2}px;
  border-radius: ${borderRadius.full}px;
  border: 1px solid ${({ theme }) => theme.colors.primary.primaryOutline};
  color: ${({ theme }) => theme.colors.primary.primary};
`;

export const PlatformList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm}px;
  margin-top: ${spacing.md}px;
`;

export const PlatformTag = styled.span`
  font-size: 12px;
  padding: ${spacing.xs}px ${spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
  color: ${({ theme }) => theme.colors.primary.primary};
  border-radius: ${borderRadius.full}px;
  font-weight: 500;
`;

export const ProductLink = styled.a`
  display: inline-block;
  margin-top: ${spacing.md}px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.primary};
  text-decoration: none;
`;
