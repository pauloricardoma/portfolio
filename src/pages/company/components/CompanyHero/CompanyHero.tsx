import Cursor from "~/components/Brand/Cursor/Cursor";
import Button from "~/components/UI/Button/Button";
import type { IDictionary } from "~/i18n/types";
import { HeroWrapper, Eyebrow, EyebrowSquare, Title, TitleEnd, Lead, Actions } from "./styles";

interface CompanyHeroProps {
  texts: IDictionary["company"]["hero"];
  email: string;
}

/**
 * Entrada em CSS (sem GSAP): o texto do hero aparece mesmo antes do JS,
 * o que ajuda o LCP (spec 0001).
 */
export default function CompanyHero({ texts, email }: CompanyHeroProps) {
  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HeroWrapper id="hero">
      <Eyebrow>
        <EyebrowSquare aria-hidden="true" />
        {texts.kicker}
      </Eyebrow>

      <Title>
        <span>PRMA</span>
        <TitleEnd>
          <span>Code</span>
          <Cursor width="0.32em" height="0.09em" offset="0.1em" />
        </TitleEnd>
      </Title>

      <Lead>{texts.subtitle}</Lead>

      <Actions>
        <Button href={`mailto:${email}`}>{texts.ctaPrimary}</Button>
        <Button href="#products" variant="outline" onClick={scrollToProducts}>
          {texts.ctaSecondary}
        </Button>
      </Actions>
    </HeroWrapper>
  );
}
