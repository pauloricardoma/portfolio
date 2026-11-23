import styled from "styled-components";

interface StyledCursorProps {
  $width: string;
  $height: string;
  $offset: string;
}

export const StyledCursor = styled.span<StyledCursorProps>`
  display: inline-block;
  flex: none;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  margin-bottom: ${({ $offset }) => $offset};
  background: ${({ theme }) => theme.colors.accent};
  animation: blink 1.1s steps(1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
