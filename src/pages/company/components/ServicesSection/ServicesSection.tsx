import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import { ServicesText, ServicesCta } from "./styles";

interface ServicesSectionProps {
  texts: IDictionary["company"]["services"];
  email: string;
}

export default function ServicesSection({ texts, email }: ServicesSectionProps) {
  const ref = useReveal();

  return (
    <Section id="services">
      <div ref={ref} style={{ textAlign: "center" }}>
        <Container>
          <Text variant="h1" align="center" className="reveal">
            {texts.title}
          </Text>
          <ServicesText className="reveal">{texts.text}</ServicesText>
          <ServicesCta href={`mailto:${email}`} className="reveal">
            {texts.cta} →
          </ServicesCta>
        </Container>
      </div>
    </Section>
  );
}
