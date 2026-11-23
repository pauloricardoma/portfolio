import type { IProject } from "~/interfaces/portfolio/IProject";
import { Dots, Dot } from "./styles";

interface CarouselDotsProps {
  projects: IProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
  label: (name: string) => string;
}

export default function CarouselDots({ projects, activeIndex, onSelect, label }: CarouselDotsProps) {
  return (
    <Dots>
      {projects.map((project, i) => (
        <Dot
          key={project.id}
          type="button"
          $active={i === activeIndex}
          aria-current={i === activeIndex ? "true" : undefined}
          aria-label={label(project.name)}
          onClick={() => onSelect(i)}
        />
      ))}
    </Dots>
  );
}
