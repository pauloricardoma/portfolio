import { Link } from "react-router";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import { FounderCard, FounderLabel, FounderText, FounderCta } from "./styles";

interface FounderSectionProps {
  texts: IDictionary["company"]["founder"];
  founderName: string;
  portfolioPath: string;
}

export default function FounderSection({
  texts,
  founderName,
  portfolioPath,
}: FounderSectionProps) {
  const ref = useReveal();

  return (
    <Section id="founder">
      <div ref={ref}>
        <Container>
          <Text variant="h1" align="center" className="reveal">
            {texts.title}
          </Text>

          <FounderCard className="reveal">
            <FounderLabel>{texts.label}</FounderLabel>
            <Text variant="h2">{founderName}</Text>
            <FounderText>{texts.text}</FounderText>
            <FounderCta as={Link} to={portfolioPath}>
              {texts.cta}
            </FounderCta>
          </FounderCard>
        </Container>
      </div>
    </Section>
  );
}
