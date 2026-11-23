import Cursor from "~/components/Brand/Cursor/Cursor";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import { ContactBand, ContactInner, Label, Title, Subtitle, EmailLink } from "./styles";

interface CompanyContactProps {
  index: string;
  texts: IDictionary["company"]["contact"];
  email: string;
}

export default function CompanyContact({ index, texts, email }: CompanyContactProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <ContactBand id="contact" ref={ref} aria-labelledby="contact-title">
      <ContactInner className="reveal">
        <Label>
          {index} / {texts.label}
        </Label>
        <Title id="contact-title">{texts.title}</Title>
        <Subtitle>{texts.subtitle}</Subtitle>
        <EmailLink href={`mailto:${email}`}>
          {email}
          <Cursor width="0.55em" height="0.08em" offset="0.18em" />
        </EmailLink>
      </ContactInner>
    </ContactBand>
  );
}
