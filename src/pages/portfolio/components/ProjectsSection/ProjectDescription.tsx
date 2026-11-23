import type { IProject } from "~/interfaces/portfolio/IProject";
import Text from "~/components/UI/Text/Text";
import { DescriptionCard, TechList, TechTag } from "./styles";

interface ProjectDescriptionProps {
  project: IProject;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <DescriptionCard>
      <Text variant="h3">{project.name}</Text>
      <Text
        variant="bodySmall"
        style={{ marginTop: 8 }}
      >
        {project.description}
      </Text>
      <TechList>
        {project.techs.map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </TechList>
    </DescriptionCard>
  );
}
