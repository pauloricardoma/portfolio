/**
 * ProjectsSection.tsx — Seção completa de projetos.
 *
 * Combina:
 * - Título com animação de scroll (GSAP ScrollTrigger)
 * - Cena 3D com o carrossel orbital (React Three Fiber)
 * - Card de descrição do projeto em foco
 * - Navegação por dots e setas
 *
 * CONCEITO IMPORTANTE: Suspense + lazy loading
 *
 * Componentes 3D são pesados (Three.js é ~600KB).
 * useTexture do drei usa Suspense pra carregar texturas.
 * O <Suspense> do React mostra um fallback enquanto carrega.
 *
 * Isso evita que a página inteira trave esperando os assets 3D.
 */
import { Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import Scene from "~/components/3D/Scene";
import ProjectsCarousel from "./ProjectsCarousel";
import ProjectDescription from "./ProjectDescription";
import {
  ProjectsSectionWrapper,
  CanvasContainer,
  DotsNav,
  Dot,
  NavArrows,
  NavArrow,
} from "./styles";
import type { IProject } from "~/interfaces/home/IProject";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  projects: IProject[];
  focusedIndex: number;
  onFocusChange: (index: number) => void;
}

export default function ProjectsSection({
  projects,
  focusedIndex,
  onFocusChange,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  /**
   * Animação de entrada da seção inteira via ScrollTrigger.
   *
   * ".projects-title": título entra com fade + slide up.
   * ".projects-canvas": o canvas 3D entra com fade + scale.
   * ".projects-info": descrição e navegação entram por último.
   *
   * stagger entre eles cria um efeito cascata suave.
   */
  /**
   * Animações individuais com ScrollTrigger próprio.
   * Evita o bug de gsap.from + timeline ScrollTrigger que
   * seta opacity:0 prematuramente.
   *
   * toggleActions: "play none none reverse"
   * → play ao entrar, reverse ao sair por cima (restaura estado)
   */
  useGSAP(
    () => {
      gsap.fromTo(".projects-title",
        { y: 30, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(".projects-canvas",
        { autoAlpha: 0, scale: 0.95 },
        {
          autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: ".projects-canvas",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(".projects-info",
        { y: 20, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-info",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: sectionRef }
  );

  const goNext = () => {
    onFocusChange((focusedIndex + 1) % projects.length);
  };

  const goPrev = () => {
    onFocusChange(
      (focusedIndex - 1 + projects.length) % projects.length
    );
  };

  return (
    <Section id="projects">
      <ProjectsSectionWrapper ref={sectionRef}>
        <Container>
          <Text
            variant="h1"
            align="center"
            className="projects-title"
            style={{ marginBottom: 32 }}
          >
            Projetos
          </Text>
        </Container>

        <CanvasContainer className="projects-canvas">
          {/**
           * Suspense: enquanto as texturas (screenshots) estão carregando,
           * mostra null (nada). Poderia ser um spinner/skeleton.
           * Quando tudo carrega, renderiza a cena completa.
           */}
          <Suspense fallback={null}>
            <Scene>
              <ProjectsCarousel
                projects={projects}
                focusedIndex={focusedIndex}
                onFocusChange={onFocusChange}
              />
            </Scene>
          </Suspense>
        </CanvasContainer>

        <Container>
          <div className="projects-info">
            <ProjectDescription project={projects[focusedIndex]} />

            <DotsNav>
              {projects.map((project, i) => (
                <Dot
                  key={project.id}
                  $active={i === focusedIndex}
                  onClick={() => onFocusChange(i)}
                  aria-label={`Ver projeto ${project.name}`}
                />
              ))}
            </DotsNav>

            <NavArrows>
              <NavArrow onClick={goPrev} aria-label="Projeto anterior">
                ←
              </NavArrow>
              <NavArrow onClick={goNext} aria-label="Próximo projeto">
                →
              </NavArrow>
            </NavArrows>
          </div>
        </Container>
      </ProjectsSectionWrapper>
    </Section>
  );
}
