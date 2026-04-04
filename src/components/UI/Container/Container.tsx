import type { ReactNode } from "react";
import { StyledContainer } from "./styles";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <StyledContainer className={className}>{children}</StyledContainer>;
}
