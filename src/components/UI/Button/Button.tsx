import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { StyledButton } from "./styles";

export type ButtonVariant = "primary" | "outline";

interface CommonProps {
  variant?: ButtonVariant;
  children: ReactNode;
}

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Botão do handoff (48px). Com `href` vira link (<a>). */
export default function Button(props: AsButton | AsLink) {
  const { variant = "primary", children, ...rest } = props;

  if (rest.href !== undefined) {
    return (
      <StyledButton as="a" $variant={variant} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton $variant={variant} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </StyledButton>
  );
}
