import styled from "styled-components";

export const ServicesLead = styled.p`
  max-width: 620px;
  font: 400 20px/1.5 ${({ theme }) => theme.font.sans};
  text-wrap: pretty;
`;

/** Faixa de passos: grid com gap de 2px sobre fundo "line" = divisórias finas */
export const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2px;
  list-style: none;
  background: ${({ theme }) => theme.colors.line};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 14px;
  overflow: hidden;
  margin: 10px 0;
`;

export const Step = styled.li`
  background: ${({ theme }) => theme.colors.card};
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const StepNumber = styled.span`
  font: 500 12px ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;

export const StepTitle = styled.span`
  font: 600 18px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.02em;
`;
