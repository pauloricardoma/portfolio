import Cursor from "~/components/Brand/Cursor/Cursor";
import { useReveal } from "~/hooks/useReveal";
import type { IDictionary } from "~/i18n/types";
import type { IContactLink } from "~/interfaces/portfolio/IContactLink";
import { ContactBand, ContactInner, Label, Title, Subtitle, Links, ContactLink } from "./styles";

interface ContactSectionProps {
  index: string;
  texts: IDictionary["portfolio"]["contact"];
  links: IContactLink[];
}

export default function ContactSection({ index, texts, links }: ContactSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <ContactBand id="contact" ref={ref} aria-labelledby="contact-title">
      <ContactInner className="reveal">
        <Label>
          {index} / {texts.label}
        </Label>
        <Title id="contact-title">
          {texts.title}
          <Cursor width="0.4em" height="0.09em" offset="0.12em" />
        </Title>
        <Subtitle>{texts.subtitle}</Subtitle>

        <Links>
          {links.map((link, i) => (
            <ContactLink
              key={link.href}
              href={link.href}
              $primary={i === 0}
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
              {link.external && <span aria-hidden="true">↗</span>}
            </ContactLink>
          ))}
        </Links>
      </ContactInner>
    </ContactBand>
  );
}
