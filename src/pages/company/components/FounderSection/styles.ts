import styled from "styled-components";
import { spacing, borderRadius } from "~/styles/tokens";

export const FounderCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm}px;
  max-width: 640px;
  margin: ${spacing.xl}px auto 0;
  padding: ${spacing.xl}px ${spacing.lg}px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
`;

export const FounderLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.primary.primary};
`;

export const FounderText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  margin-top: ${spacing.xs}px;
`;

export const FounderCta = styled.a`
  margin-top: ${spacing.md}px;
  padding: ${spacing.sm + 2}px ${spacing.lg}px;
  border-radius: ${borderRadius.md}px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  background-color: ${({ theme }) => theme.colors.primary.primary};
  color: ${({ theme }) => theme.colors.primary.onPrimary};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.primaryHover};
    transform: translateY(-2px);
  }
`;
