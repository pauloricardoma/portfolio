import styled, { keyframes } from "styled-components";
import { spacing, breakpoints } from "~/styles/tokens";

export const HeroWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

/** Filhos nascem com visibility: hidden e o GSAP revela (evita flash no SSR). */
export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${spacing.lg}px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${spacing.lg}px;

  .hero-kicker,
  .hero-title,
  .hero-accent,
  .hero-subtitle {
    visibility: hidden;
  }
`;

export const Kicker = styled.p`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ theme }) => theme.colors.primary.primary};
`;

export const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  max-width: 600px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 20px;
  }
`;

export const AccentLine = styled.div`
  width: 60px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.primary.primary};
  border-radius: 2px;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(12px);
    opacity: 1;
  }
`;

export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: ${spacing.xl}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm}px;
  animation: ${bounce} 2s ease-in-out infinite;
  cursor: pointer;
  visibility: hidden;
`;

export const ScrollText = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
`;

export const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  border-bottom: 2px solid ${({ theme }) => theme.colors.surface.onSurfaceVariant};
  transform: rotate(45deg);
`;
