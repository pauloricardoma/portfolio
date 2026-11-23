import { lazy, Suspense, type KeyboardEvent } from "react";
import WebGLBoundary from "~/components/3D/WebGLBoundary";
import { useWebGLSupport } from "~/hooks/useWebGLSupport";
import type { IDictionary } from "~/i18n/types";
import type { IProject } from "~/interfaces/portfolio/IProject";
import CarouselDots from "./CarouselDots";
import ProjectScreenshotFallback from "./ProjectScreenshotFallback";
import { Stage, StageFloor, StageCanvas } from "./styles";

/** Three.js num chunk próprio: só baixa aqui e só com WebGL disponível */
const ProjectsScene = lazy(() => import("./ProjectsScene"));

interface ProjectsStageProps {
  texts: IDictionary["portfolio"]["projects"];
  projects: IProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function ProjectsStage({
  texts,
  projects,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  className,
}: ProjectsStageProps) {
  const webgl = useWebGLSupport();
  const active = projects[activeIndex];

  const fallback = (
    <ProjectScreenshotFallback project={active} alt={texts.screenshotAlt(active.name)} />
  );

  /** ← → só com foco no palco: fora dele, as setas continuam rolando a página */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <Stage
      className={className}
      role="region"
      aria-roledescription={texts.carouselRole}
      aria-label={texts.carouselLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <StageFloor />

      {/* null = ainda detectando (SSR e primeiro render): palco vazio */}
      {webgl === false && fallback}
      {webgl === true && (
        <WebGLBoundary fallback={fallback}>
          <StageCanvas>
            <Suspense fallback={null}>
              <ProjectsScene projects={projects} activeIndex={activeIndex} onSelect={onSelect} />
            </Suspense>
          </StageCanvas>
        </WebGLBoundary>
      )}

      <CarouselDots
        projects={projects}
        activeIndex={activeIndex}
        onSelect={onSelect}
        label={texts.goTo}
      />
    </Stage>
  );
}
