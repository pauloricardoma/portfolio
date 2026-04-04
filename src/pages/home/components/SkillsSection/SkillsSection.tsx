/**
 * SkillsSection.tsx — Seção de habilidades técnicas.
 *
 * BUG CORRIGIDO: gsap.from() dentro de timeline com ScrollTrigger
 *
 * O PROBLEMA:
 * Quando você usa gsap.from() dentro de uma timeline que tem ScrollTrigger,
 * o GSAP imediatamente seta os valores "from" (autoAlpha: 0, y: 40) nos elementos
 * NO MOMENTO DA CRIAÇÃO da timeline — antes mesmo do scroll acontecer.
 * A animação de volta só roda quando o ScrollTrigger ativa.
 *
 * Se o trigger já foi ultrapassado (ex: hot reload com scroll preservado),
 * a timeline nunca "plays" e os elementos ficam presos em opacity: 0.
 *
 * A SOLUÇÃO:
 * Em vez de uma timeline global, usamos ScrollTriggers INDIVIDUAIS.
 * Cada elemento tem seu próprio ScrollTrigger com gsap.from().
 * O truque é usar ScrollTrigger.batch() — ele agrupa elementos com o
 * mesmo trigger e aplica stagger automaticamente.
 *
 * ScrollTrigger.batch() é FEITO pra esse caso:
 * - Pega todos os ".skill-card"
 * - Quando CADA UM entra na viewport, dispara a animação
 * - O "interval" define o delay entre eles (stagger natural pelo scroll)
 * - Não seta opacity:0 prematuramente — só anima quando realmente visível
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import SkillCategory, { type ISkillCategory } from "./SkillCategory";
import { SkillsWrapper, CategoriesGrid } from "./styles";

gsap.registerPlugin(ScrollTrigger);

interface SkillsSectionProps {
  categories: ISkillCategory[];
}

export default function SkillsSection({ categories }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /**
       * Título: fromTo com autoAlpha explícito.
       * visibility: hidden no CSS → autoAlpha atual = 0.
       * Precisamos de fromTo pra definir autoAlpha: 1 como destino.
       */
      gsap.fromTo(".skills-title",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /**
       * Abordagem mais confiável: gsap.utils.toArray + forEach.
       *
       * Pegamos todos os cards, iteramos, e cada um recebe seu próprio
       * gsap.fromTo com ScrollTrigger individual.
       *
       * O "delay: index * 0.12" cria o efeito stagger manualmente —
       * cada card espera um pouco mais que o anterior.
       *
       * Isso é mais previsível que batch() porque:
       * - Cada card controla sua própria animação
       * - Não depende de agrupamento por timing
       * - Funciona igual em qualquer resolução/grid
       */
      const cards = gsap.utils.toArray<HTMLElement>(".skill-card");
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            delay: index * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );

        /** Barra de proficiência dentro de cada card */
        const fill = card.querySelector(".proficiency-fill") as HTMLElement;
        if (fill) {
          const level = fill.dataset.level || "0";
          gsap.to(fill, {
            width: `${level}%`,
            duration: 1,
            delay: 0.3 + index * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <Section id="skills">
      <SkillsWrapper ref={sectionRef}>
        <Container>
          <Text
            variant="h1"
            align="center"
            className="skills-title"
          >
            Skills
          </Text>

          <CategoriesGrid>
            {categories.map((category) => (
              <SkillCategory
                key={category.name}
                category={category}
                className="skill-card"
              />
            ))}
          </CategoriesGrid>
        </Container>
      </SkillsWrapper>
    </Section>
  );
}
