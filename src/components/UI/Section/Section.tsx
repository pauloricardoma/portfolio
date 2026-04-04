import type { ReactNode } from "react";
import { StyledSection } from "./styles";

interface SectionProps {
  fullHeight?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({
  fullHeight,
  children,
  className,
  id,
}: SectionProps) {
  return (
    <StyledSection $fullHeight={fullHeight} className={className} id={id}>
      {children}
    </StyledSection>
  );
}
