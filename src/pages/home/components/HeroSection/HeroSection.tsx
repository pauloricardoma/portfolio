/**
 * HeroSection.tsx — Seção principal de apresentação (fullscreen).
 *
 * CONCEITOS GSAP USADOS AQUI:
 *
 * 1. gsap.timeline() — Uma timeline é uma sequência de animações.
 *    Em vez de definir delays manuais pra cada animação, você adiciona
 *    elas na timeline e o GSAP calcula a ordem automaticamente.
 *    Pense como uma linha do tempo de um vídeo — cada animação é um "clip".
 *
 * 2. tl.from(elemento, config) — Adiciona uma animação na timeline.
 *    O GSAP anima DE (from) o estado definido PARA o estado atual do CSS.
 *    Ex: tl.from(el, { y: 30, opacity: 0 }) → começa 30px abaixo e invisível,
 *    termina na posição original e visível.
 *
 * 3. position parameter ("<0.2") — Controla QUANDO a animação começa
 *    RELATIVO à anterior:
 *    - "<0.2" = começa 0.2s DEPOIS do início da animação anterior
 *    - "+=0.5" = começa 0.5s depois do FIM da anterior
 *    - "<" = começa ao MESMO TEMPO que a anterior
 *
 * 4. stagger — Quando o target é múltiplos elementos (array/NodeList),
 *    stagger adiciona um delay entre cada um. Ex: stagger: 0.1 faz
 *    cada elemento começar 0.1s depois do anterior (efeito cascata).
 *
 * 5. useGSAP(callback, { scope: containerRef }) —
 *    scope limita os seletores GSAP ao container. gsap.from(".hero-title")
 *    só procura elementos com essa classe DENTRO do containerRef.
 *    Isso evita conflitos com outros componentes que tenham a mesma classe.
 *
 * 6. ScrollTrigger — Vincula uma animação ao scroll:
 *    - trigger: elemento que ativa
 *    - start/end: posição de ativação
 *    - scrub: true = animação acompanha o scroll 1:1 (parallax)
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Text from "~/components/UI/Text/Text";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import {
  HeroWrapper,
  HeroContent,
  HeroSubtitle,
  AccentLine,
  ScrollIndicator,
  ScrollText,
  ScrollArrow,
} from "./styles";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  /**
   * containerRef — Referência ao elemento DOM que contém todo o Hero.
   * Passamos como "scope" pro useGSAP pra que os seletores de classe
   * (como ".hero-name") só busquem dentro desse container.
   */
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /**
       * Timeline de entrada — sequência de animações ao carregar a página.
       *
       * IMPORTANTE: usamos fromTo() em vez de from() porque os elementos
       * começam com visibility: hidden no CSS (pra evitar flash no SSR).
       *
       * gsap.from({ autoAlpha: 0 }) lê o valor ATUAL como destino.
       * Com visibility: hidden, o autoAlpha atual é 0 → anima de 0 a 0 (nada!).
       *
       * gsap.fromTo() resolve isso: definimos EXPLICITAMENTE o destino { autoAlpha: 1 }.
       * O GSAP seta visibility: inherit automaticamente quando autoAlpha > 0.
       */
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      tl.fromTo(".hero-name",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1 },
      )
        .fromTo(
          ".hero-accent",
          { scaleX: 0, autoAlpha: 0 },
          { scaleX: 1, autoAlpha: 1, duration: 0.6 },
          "<0.3"
        )
        .fromTo(
          ".hero-title",
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1 },
          "<0.2"
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

      /**
       * Parallax no scroll — quando o usuário rola a página,
       * o conteúdo do Hero sobe mais rápido que o scroll normal
       * e fica transparente, criando um efeito de profundidade.
       *
       * scrub: true faz a animação acompanhar o scroll 1:1
       * (não é uma animação que "plays", é vinculada ao progresso do scroll).
       */
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
            <Text variant="h3" className="hero-name" weight="medium">
              Paulo Ricardo Almeida
            </Text>

            <AccentLine className="hero-accent" />

            <Text variant="hero" className="hero-title">
              Software Engineer
            </Text>

            <HeroSubtitle className="hero-subtitle">
              +4 anos construindo aplicações web e mobile de alta complexidade
              com React, TypeScript e Node.js — do desenho da solução à entrega em produção.
            </HeroSubtitle>
          </HeroContent>
        </Container>

        <ScrollIndicator
          className="hero-scroll"
          onClick={() =>
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <ScrollText>Scroll</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      </HeroWrapper>
    </Section>
  );
}
