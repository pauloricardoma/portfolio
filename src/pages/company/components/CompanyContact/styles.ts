import styled from "styled-components";
import { layout, type } from "~/styles/tokens";

/** Faixa sempre escura, nos dois temas */
export const ContactBand = styled.section`
  background: ${({ theme }) => theme.colors.contact.bg};
  color: ${({ theme }) => theme.colors.contact.ink};
  scroll-margin-top: 60px;
`;

export const ContactInner = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: 112px ${layout.gutter}px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const Label = styled.span`
  font: ${type.eyebrow} ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.contact.label};
`;

export const Title = styled.h2`
  font: 600 clamp(40px, 6vw, 72px) / 1 ${({ theme }) => theme.font.sans};
  letter-spacing: -0.045em;
`;

export const Subtitle = styled.p`
  max-width: 560px;
  font: 400 18px/1.55 ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.contact.body};
  text-wrap: pretty;
`;

export const EmailLink = styled.a`
  align-self: flex-start;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  max-width: 100%;
  overflow-wrap: anywhere;
  font: 500 clamp(24px, 4vw, 44px) ${({ theme }) => theme.font.mono};
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.contact.ink};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
