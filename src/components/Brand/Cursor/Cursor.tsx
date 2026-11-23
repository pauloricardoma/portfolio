import { StyledCursor } from "./styles";

interface CursorProps {
  /** Largura (qualquer unidade CSS; em "em" acompanha o texto) */
  width: string;
  height: string;
  /** Distância da linha de base */
  offset?: string;
  className?: string;
}

/** Cursor de terminal piscando. Fica estático com prefers-reduced-motion. */
export default function Cursor({ width, height, offset = "0", className }: CursorProps) {
  return (
    <StyledCursor
      aria-hidden="true"
      className={className}
      $width={width}
      $height={height}
      $offset={offset}
    />
  );
}
