/**
 * ProjectsSection.tsx — "01 / Projects": palco 3D, controles e detalhes.
 *
 * A seção sai no SSR; só a cena Three.js dentro do palco é lazy
 * (ver ProjectsStage). O projeto ativo mora no usePortfolio.
 */
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import type { IProject } from "~/interfaces/portfolio/IProject";
import CarouselControls from "./CarouselControls";
import ProjectsStage from "./ProjectsStage";
import ProjectDetails from "./ProjectDetails";
import {
  SectionWrapper,
  SectionInner,
  TopRow,
  Heading,
  Index,
  Title,
  DetailsList,
} from "./styles";

interface ProjectsSectionProps {
  index: string;
  texts: IDictionary["portfolio"]["projects"];
  projects: IProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ProjectsSection({
  index,
  texts,
  projects,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
}: ProjectsSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <SectionWrapper id="projects" ref={ref} aria-labelledby="projects-title">
      <SectionInner>
        <TopRow className="reveal">
          <Heading>
            <Index>
              {index} / {texts.label}
            </Index>
            <Title id="projects-title">{texts.title}</Title>
          </Heading>
          <CarouselControls
            texts={texts}
            activeIndex={activeIndex}
            total={projects.length}
            onPrev={onPrev}
            onNext={onNext}
          />
        </TopRow>

        <ProjectsStage
          className="reveal"
          texts={texts}
          projects={projects}
          activeIndex={activeIndex}
          onSelect={onSelect}
          onPrev={onPrev}
          onNext={onNext}
        />

        <DetailsList className="reveal">
          <ProjectDetails texts={texts} project={projects[activeIndex]} index={activeIndex} />
        </DetailsList>
      </SectionInner>
    </SectionWrapper>
  );
}
