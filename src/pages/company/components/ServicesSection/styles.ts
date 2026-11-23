import styled from "styled-components";
import { spacing, borderRadius } from "~/styles/tokens";

export const ServicesText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  max-width: 640px;
  margin: ${spacing.md}px auto 0;
`;

export const ServicesCta = styled.a`
  display: inline-block;
  margin-top: ${spacing.xl}px;
  padding: ${spacing.sm + 2}px ${spacing.lg}px;
  border-radius: ${borderRadius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.primary.primaryOutline};
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary.primary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
    transform: translateY(-2px);
  }
`;
