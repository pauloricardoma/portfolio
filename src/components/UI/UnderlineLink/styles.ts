import styled from "styled-components";

export const StyledUnderlineLink = styled.a`
  align-self: flex-start;
  font: 600 16px ${({ theme }) => theme.font.sans};
  border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
  padding-bottom: 3px;
  transition: color 0.2s ease;

  /* Texto pequeno laranja não passa no AA sobre fundo claro: só no escuro */
  :root[data-theme="dark"] &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
