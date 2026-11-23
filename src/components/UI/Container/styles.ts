import styled from "styled-components";
import { layout } from "~/styles/tokens";

export const StyledContainer = styled.div`
  width: 100%;
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: 0 ${layout.gutter}px;
`;
