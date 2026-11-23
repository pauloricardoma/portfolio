import styled from "styled-components";
import { spacing, borderRadius } from "~/styles/tokens";

export const ContactWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const ContactSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  max-width: 500px;
  margin: ${spacing.md}px auto 0;
`;

export const EmailCard = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${spacing.sm}px;
  margin-top: ${spacing.xl}px;
  padding: ${spacing.md}px ${spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
  color: ${({ theme }) => theme.colors.surface.onSurface};
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.primary};
    background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
    color: ${({ theme }) => theme.colors.primary.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

/** Rodapé fica sempre visível (sem animação): CNPJ precisa estar legível de cara */
export const Footer = styled.footer`
  margin-top: ${spacing.xxxl}px;
  padding-top: ${spacing.lg}px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  text-align: center;
`;

export const FooterText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.surface.onSurfacePlaceholder};
`;
