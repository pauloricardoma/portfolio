import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Text from "~/components/UI/Text/Text";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import type { IDictionary } from "~/i18n/types";
import {
  HeroWrapper,
  HeroContent,
  Kicker,
  HeroSubtitle,
  AccentLine,
  ScrollIndicator,
  ScrollText,
  ScrollArrow,
} from "./styles";

gsap.registerPlugin(ScrollTrigger);

interface CompanyHeroProps {
  texts: IDictionary["company"]["hero"];
}

export default function CompanyHero({ texts }: CompanyHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      tl.fromTo(".hero-kicker", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1 })
        .fromTo(
          ".hero-title",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1 },
          "<0.2"
        )
        .fromTo(
          ".hero-accent",
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 0.6 },
          "<0.3"
        )
        .fromTo(
          ".hero-subtitle",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1 },
          "<0.2"
        )
        .fromTo(
          ".hero-scroll",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          "<0.4"
        );

      gsap.to(".hero-content", {
        y: -100,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <Section fullHeight id="hero">
      <HeroWrapper ref={containerRef}>
        <Container>
          <HeroContent className="hero-content">
            <Kicker className="hero-kicker">{texts.kicker}</Kicker>

            <Text variant="hero" className="hero-title">
              PRMA Code
            </Text>

            <AccentLine className="hero-accent" />

            <HeroSubtitle className="hero-subtitle">{texts.subtitle}</HeroSubtitle>
          </HeroContent>
        </Container>

        <ScrollIndicator
          className="hero-scroll"
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <ScrollText>{texts.scroll}</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      </HeroWrapper>
    </Section>
  );
}
