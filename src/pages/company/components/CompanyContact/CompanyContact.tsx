import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import {
  ContactWrapper,
  ContactSubtitle,
  EmailCard,
  Footer,
  FooterText,
} from "./styles";

interface CompanyContactProps {
  texts: IDictionary["company"]["contact"];
  cnpjLabel: string;
  companyName: string;
  email: string;
  cnpj: string;
}

export default function CompanyContact({
  texts,
  cnpjLabel,
  companyName,
  email,
  cnpj,
}: CompanyContactProps) {
  const ref = useReveal();

  return (
    <Section id="contact">
      <ContactWrapper ref={ref}>
        <Container>
          <Text variant="h1" align="center" className="reveal">
            {texts.title}
          </Text>
          <ContactSubtitle className="reveal">{texts.subtitle}</ContactSubtitle>

          <EmailCard href={`mailto:${email}`} className="reveal">
            <span aria-hidden="true">✉️</span>
            {email}
          </EmailCard>

          <Footer>
            <FooterText>
              &copy; {new Date().getFullYear()} {companyName} · {cnpjLabel}: {cnpj}
            </FooterText>
          </Footer>
        </Container>
      </ContactWrapper>
    </Section>
  );
}
