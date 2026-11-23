import type { MouseEvent } from "react";
import Cursor from "~/components/Brand/Cursor/Cursor";
import Button from "~/components/UI/Button/Button";
import type { IDictionary } from "~/i18n/types";
import { HeroWrapper, Eyebrow, EyebrowSquare, Title, TitleEnd, Lead, Actions } from "./styles";

interface HeroSectionProps {
  texts: IDictionary["portfolio"]["hero"];
  name: string;
}

/** Entrada em CSS (sem GSAP): o texto aparece antes do JS, o que ajuda o LCP. */
export default function HeroSection({ texts, name }: HeroSectionProps) {
  const scrollTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HeroWrapper id="hero">
      <Eyebrow>
        <EyebrowSquare aria-hidden="true" />
        {texts.eyebrow(name)}
      </Eyebrow>

      <Title>
        <span>{texts.titleStart}</span>
        <TitleEnd>
          <span>{texts.titleEnd}</span>
          <Cursor width="0.32em" height="0.09em" offset="0.1em" />
        </TitleEnd>
      </Title>

      <Lead>{texts.subtitle}</Lead>

      <Actions>
        <Button href="#projects" onClick={(e) => scrollTo(e, "projects")}>
          {texts.ctaProjects}
        </Button>
        <Button href="#contact" variant="outline" onClick={(e) => scrollTo(e, "contact")}>
          {texts.ctaContact}
        </Button>
      </Actions>
    </HeroWrapper>
  );
}
