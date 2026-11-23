import type { ReactNode } from "react";
import { Link } from "react-router";
import { StyledUnderlineLink } from "./styles";

interface UnderlineLinkProps {
  /** Caminho de rota ("/portfolio") ou URL/mailto */
  href: string;
  /** true: navegação interna pelo React Router */
  route?: boolean;
  children: ReactNode;
}

/** Link de chamada com sublinhado laranja de 2px (handoff). */
export default function UnderlineLink({ href, route, children }: UnderlineLinkProps) {
  if (route) {
    return (
      <StyledUnderlineLink as={Link} to={href}>
        {children}
      </StyledUnderlineLink>
    );
  }
  return <StyledUnderlineLink href={href}>{children}</StyledUnderlineLink>;
}
