import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import type { ISkillCategory } from "~/interfaces/portfolio/ISkillCategory";
import SkillGroup from "./SkillGroup";
import { SectionWrapper, SectionInner, Heading, Index, Title, Groups } from "./styles";

interface SkillsSectionProps {
  index: string;
  texts: IDictionary["portfolio"]["skills"];
  categories: ISkillCategory[];
}

export default function SkillsSection({ index, texts, categories }: SkillsSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <SectionWrapper id="skills" ref={ref} aria-labelledby="skills-title">
      <SectionInner>
        <Heading className="reveal">
          <Index>
            {index} / {texts.label}
          </Index>
          <Title id="skills-title">{texts.title}</Title>
        </Heading>

        <Groups className="reveal">
          {categories.map((category, i) => (
            <SkillGroup key={category.name} category={category} index={i} />
          ))}
        </Groups>
      </SectionInner>
    </SectionWrapper>
  );
}
