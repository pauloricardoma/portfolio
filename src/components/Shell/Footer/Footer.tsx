import LogoMark from "~/components/Brand/LogoMark/LogoMark";
import { FooterWrapper, FooterInner, FooterBrand } from "./styles";

interface FooterProps {
  /** Texto ao lado da marca ("© 2026 PRMA Code") */
  left: string;
  /** Texto à direita ("CNPJ 45.056.853/0001-83") */
  right: string;
}

export default function Footer({ left, right }: FooterProps) {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterBrand>
          <LogoMark size={22} />
          {left}
        </FooterBrand>
        <span>{right}</span>
      </FooterInner>
    </FooterWrapper>
  );
}
