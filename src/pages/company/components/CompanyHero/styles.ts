import styled, { keyframes } from "styled-components";
import { layout, type } from "~/styles/tokens";

const enter = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
`;

export const HeroWrapper = styled.section`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: ${layout.heroPaddingTop}px ${layout.gutter}px ${layout.sectionPadding}px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  > * {
    animation: ${enter} 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  > :nth-child(2) { animation-delay: 0.08s; }
  > :nth-child(3) { animation-delay: 0.16s; }
  > :nth-child(4) { animation-delay: 0.24s; }
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  font: ${type.eyebrow} ${({ theme }) => theme.font.mono};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

export const EyebrowSquare = styled.span`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  font: ${type.heroTitle} ${({ theme }) => theme.font.sans};
  letter-spacing: ${type.heroTracking};
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 0 0.22em;
`;

export const TitleEnd = styled.span`
  display: flex;
  align-items: flex-end;
  gap: 0.06em;

  > span:first-child {
    font-weight: 400;
  }
`;

export const Lead = styled.p`
  max-width: 620px;
  font: ${type.lead} ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
