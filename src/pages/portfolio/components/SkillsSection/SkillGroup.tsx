import Chip from "~/components/UI/Chip/Chip";
import { ChipList } from "~/components/UI/Chip/styles";
import type { ISkillCategory } from "~/interfaces/portfolio/ISkillCategory";
import { Group, GroupHeader, GroupTitle, GroupIndex } from "./styles";

interface SkillGroupProps {
  category: ISkillCategory;
  index: number;
}

export default function SkillGroup({ category, index }: SkillGroupProps) {
  return (
    <Group>
      <GroupHeader>
        <GroupTitle>{category.name}</GroupTitle>
        <GroupIndex aria-hidden="true">{String(index + 1).padStart(2, "0")}</GroupIndex>
      </GroupHeader>
      <ChipList>
        {category.skills.map((skill) => (
          <Chip key={skill} filled>
            {skill}
          </Chip>
        ))}
      </ChipList>
    </Group>
  );
}
