import Text from "~/components/UI/Text/Text";
import {
  CategoryCard,
  CategoryTitle,
  CategoryIcon,
  SkillsGrid,
  SkillTag,
  ProficiencyBar,
  ProficiencyFill,
} from "./styles";

export interface ISkillCategory {
  name: string;
  icon: string;
  /** 0-100, representa o domínio geral da categoria */
  proficiency: number;
  skills: string[];
}

interface SkillCategoryProps {
  category: ISkillCategory;
  className?: string;
}

export default function SkillCategory({ category, className }: SkillCategoryProps) {
  return (
    <CategoryCard className={className}>
      <CategoryTitle>
        <CategoryIcon>{category.icon}</CategoryIcon>
        <Text variant="h4">{category.name}</Text>
      </CategoryTitle>

      <SkillsGrid>
        {category.skills.map((skill) => (
          <SkillTag key={skill}>{skill}</SkillTag>
        ))}
      </SkillsGrid>

      <ProficiencyBar>
        <ProficiencyFill
          $level={category.proficiency}
          className="proficiency-fill"
          data-level={category.proficiency}
        />
      </ProficiencyBar>
    </CategoryCard>
  );
}
