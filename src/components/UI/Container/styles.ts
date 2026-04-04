import styled from "styled-components";
import { spacing, breakpoints } from "~/styles/tokens";

export const StyledContainer = styled.div`
  width: 100%;
  max-width: ${breakpoints.wide}px;
  margin: 0 auto;
  padding: 0 ${spacing.lg}px;

  @media (min-width: ${breakpoints.desktop}px) {
    padding: 0 ${spacing.xxl}px;
  }
`;
