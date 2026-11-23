import styled, { css } from "styled-components";
import { borderRadius, layout, type } from "~/styles/tokens";

/** Faixa sempre escura, nos dois temas (igual à home) */
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
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 0.08em;
  font: 600 clamp(40px, 6vw, 72px) / 1 ${({ theme }) => theme.font.sans};
  letter-spacing: -0.045em;
`;

export const Subtitle = styled.p`
  max-width: 560px;
  font: 400 18px/1.55 ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.contact.body};
  text-wrap: pretty;
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ContactLink = styled.a<{ $primary: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 52px;
  padding: 0 22px;
  border-radius: ${borderRadius.button}px;
  font: 500 15px ${({ theme }) => theme.font.sans};
  transition: filter 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  ${({ $primary }) =>
    $primary
      ? css`
          font-weight: 600;
          background: ${({ theme }) => theme.colors.accent};
          color: ${({ theme }) => theme.colors.onAccent};

          &:hover {
            filter: brightness(1.06);
          }
        `
      : css`
          border: 1px solid ${({ theme }) => theme.colors.contact.border};
          color: ${({ theme }) => theme.colors.contact.ink};

          &:hover {
            border-color: ${({ theme }) => theme.colors.accent};
            color: ${({ theme }) => theme.colors.accent};
          }
        `}
`;
