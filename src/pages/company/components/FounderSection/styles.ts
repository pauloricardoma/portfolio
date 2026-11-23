import styled from "styled-components";

export const FounderName = styled.h3`
  font: 600 30px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.03em;
`;

export const FounderText = styled.p`
  max-width: 620px;
  font: 400 18px/1.55 ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;
