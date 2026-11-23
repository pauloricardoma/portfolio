import styled from "styled-components";
import { layout } from "~/styles/tokens";

export const FooterWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

export const FooterInner = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: 28px ${layout.gutter}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font: 400 13px ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
`;

export const FooterBrand = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
`;
