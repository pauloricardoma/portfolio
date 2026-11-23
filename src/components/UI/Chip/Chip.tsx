import type { ReactNode } from "react";
import { StyledChip } from "./styles";

interface ChipProps {
  children: ReactNode;
  /** Fundo da página por trás do chip (usado dentro de cards) */
  filled?: boolean;
}

export default function Chip({ children, filled }: ChipProps) {
  return <StyledChip $filled={filled}>{children}</StyledChip>;
}
