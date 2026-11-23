import styled from "styled-components";
import { borderRadius } from "~/styles/tokens";

export const ChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
`;

export const StyledChip = styled.li<{ $filled?: boolean }>`
  font: 500 13px ${({ theme }) => theme.font.mono};
  padding: 8px 12px;
  border-radius: ${borderRadius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme, $filled }) => ($filled ? theme.colors.bg : "transparent")};
`;
