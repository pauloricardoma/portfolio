import styled from "styled-components";
import { layout, type } from "~/styles/tokens";

export const Wrapper = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  scroll-margin-top: 60px;
`;

export const Grid = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: ${layout.sectionPadding}px ${layout.gutter}px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 48px;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Index = styled.span`
  font: ${type.eyebrow} ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;

export const Title = styled.h2`
  font: ${type.h2} ${({ theme }) => theme.font.sans};
  letter-spacing: ${type.h2Tracking};
`;

export const Content = styled.div`
  grid-column: span 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;

  /*
   * Abaixo de ~736px a grade tem uma coluna (2 × 320 + 48 + 2 × 24 de gutter);
   * aí o span 2 criaria uma coluna implícita.
   */
  @media (max-width: 735px) {
    grid-column: auto;
  }
`;
