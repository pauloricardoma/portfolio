import SplitSection from "~/components/UI/SplitSection/SplitSection";
import UnderlineLink from "~/components/UI/UnderlineLink/UnderlineLink";
import Chip from "~/components/UI/Chip/Chip";
import { ChipList } from "~/components/UI/Chip/styles";
import type { IDictionary } from "~/i18n/types";
import { FounderName, FounderText } from "./styles";

interface FounderSectionProps {
  index: string;
  texts: IDictionary["company"]["founder"];
  founderName: string;
  stack: readonly string[];
  portfolioPath: string;
}

export default function FounderSection({
  index,
  texts,
  founderName,
  stack,
  portfolioPath,
}: FounderSectionProps) {
  return (
    <SplitSection id="founder" index={index} label={texts.label} title={texts.title}>
      <FounderName>{founderName}</FounderName>
      <FounderText>{texts.text}</FounderText>
      <ChipList>
        {stack.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </ChipList>
      <UnderlineLink href={portfolioPath} route>
        {texts.cta}
      </UnderlineLink>
    </SplitSection>
  );
}
