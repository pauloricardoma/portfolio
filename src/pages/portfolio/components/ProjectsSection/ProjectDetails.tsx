import Chip from "~/components/UI/Chip/Chip";
import { ChipList } from "~/components/UI/Chip/styles";
import type { IDictionary } from "~/i18n/types";
import type { IProject } from "~/interfaces/portfolio/IProject";
import MetricCard from "./MetricCard";
import {
  Details,
  DetailsHeading,
  Index,
  ProjectName,
  ProjectKind,
  DetailsBody,
  Metrics,
  Description,
} from "./styles";

interface ProjectDetailsProps {
  texts: IDictionary["portfolio"]["projects"];
  project: IProject;
  index: number;
}

export default function ProjectDetails({ texts, project, index }: ProjectDetailsProps) {
  return (
    // key: remonta a cada troca, o que refaz a animação de entrada
    <Details key={project.id}>
      <DetailsHeading>
        <Index>
          {String(index + 1).padStart(2, "0")} · {texts.platform[project.type]}
        </Index>
        <ProjectName>{project.name}</ProjectName>
        <ProjectKind>{project.kind}</ProjectKind>
      </DetailsHeading>

      <DetailsBody>
        {project.metrics.length > 0 && (
          <Metrics aria-label={texts.metricsLabel}>
            {project.metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </Metrics>
        )}
        <Description>{project.description}</Description>
        <ChipList>
          {project.techs.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </ChipList>
      </DetailsBody>
    </Details>
  );
}
