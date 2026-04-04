import type { ButtonHTMLAttributes, ReactNode } from "react";
import { StyledButton } from "./styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} {...rest}>
      {children}
    </StyledButton>
  );
}
