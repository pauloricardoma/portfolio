import styled from "styled-components";
import { spacing, borderRadius, breakpoints } from "~/styles/tokens";

/**
 * ContactWrapper — CLS fix: filhos animados com gsap.from({ opacity: 0 })
 * começam invisíveis no CSS pra evitar flash visível → invisível → animado.
 */
export const ContactWrapper = styled.div`
  width: 100%;
  text-align: center;

  .contact-title,
  .contact-subtitle,
  .contact-link,
  .contact-footer {
    visibility: hidden;
  }
`;

export const ContactSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  max-width: 500px;
  margin: ${spacing.md}px auto 0;
`;

export const LinksGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${spacing.md}px;
  margin-top: ${spacing.xl}px;
`;

export const ContactLinkCard = styled.a`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
  padding: ${spacing.md}px ${spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.surface.surfaceContainer};
  border: 1px solid ${({ theme }) => theme.colors.surface.surfaceOutline};
  border-radius: ${borderRadius.lg}px;
  color: ${({ theme }) => theme.colors.surface.onSurface};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.primary};
    background-color: ${({ theme }) => theme.colors.primary.primaryContainer};
    color: ${({ theme }) => theme.colors.primary.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const LinkIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;

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
