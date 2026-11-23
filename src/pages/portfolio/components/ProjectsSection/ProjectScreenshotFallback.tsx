import type { IProject } from "~/interfaces/portfolio/IProject";
import { FallbackFrame, FallbackDevice } from "./styles";

interface ProjectScreenshotFallbackProps {
  project: IProject;
  alt: string;
}

/** Sem WebGL (ou se a cena 3D falhar): a screenshot do projeto ativo num quadro simples */
export default function ProjectScreenshotFallback({ project, alt }: ProjectScreenshotFallbackProps) {
  return (
    <FallbackFrame>
      <FallbackDevice $device={project.type}>
        <img src={project.screenshot} alt={alt} loading="lazy" decoding="async" />
      </FallbackDevice>
    </FallbackFrame>
  );
}
