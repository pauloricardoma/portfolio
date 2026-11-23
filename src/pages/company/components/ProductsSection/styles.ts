import styled from "styled-components";
import { borderRadius, type } from "~/styles/tokens";

export const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.card}px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ProductName = styled.h3`
  font: 600 26px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.025em;
`;

export const StatusPill = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font: 500 12px ${({ theme }) => theme.font.mono};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.full}px;
  padding: 6px 12px;
`;

export const Description = styled.p`
  max-width: 560px;
  font: ${type.body} ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;

export const Platforms = styled.ul`
  display: flex;
  gap: 16px;
  list-style: none;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  font: 500 13px ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;

export const ProductLink = styled.a`
  align-self: flex-start;
  font: 600 15px ${({ theme }) => theme.font.sans};
  border-bottom: 2px solid ${({ theme }) => theme.colors.accent};
`;
