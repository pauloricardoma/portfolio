import styled from "styled-components";
import { borderRadius, layout, type } from "~/styles/tokens";

export const SectionWrapper = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  scroll-margin-top: 60px;
`;

export const SectionInner = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: ${layout.sectionPadding}px ${layout.gutter}px;
  display: flex;
  flex-direction: column;
  gap: 40px;
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

/** Grade com divisórias de 1px: o fundo `line` aparece no gap entre os cards */
export const Groups = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1px;
  list-style: none;
  background: ${({ theme }) => theme.colors.line};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.card}px;
  overflow: hidden;
`;

export const Group = styled.li`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px;
  background: ${({ theme }) => theme.colors.card};
`;

export const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
`;

export const GroupTitle = styled.h3`
  font: 600 19px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.02em;
`;

export const GroupIndex = styled.span`
  font: 500 12px ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;
