/**
 * ContactSection.tsx — Seção de contato + footer.
 *
 * Links de contato abrem em nova aba (target="_blank").
 * rel="noopener noreferrer" é segurança — impede que a página
 * aberta tenha acesso ao window.opener da sua página.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Section from "~/components/UI/Section/Section";
import Container from "~/components/UI/Container/Container";
import Text from "~/components/UI/Text/Text";
import {
  ContactWrapper,
  ContactSubtitle,
  LinksGrid,
  ContactLinkCard,
  LinkIcon,
  Footer,
  FooterText,
} from "./styles";

gsap.registerPlugin(ScrollTrigger);

interface ContactLink {
  label: string;
  href: string;
  icon: string;
}

interface ContactSectionProps {
  links: ContactLink[];
}

export default function ContactSection({ links }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".contact-title",
        { y: 30, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(".contact-subtitle",
        { y: 20, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-subtitle",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      const contactLinks = gsap.utils.toArray<HTMLElement>(".contact-link");
      contactLinks.forEach((link, index) => {
        gsap.fromTo(link,
          { y: 20, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, duration: 0.4, delay: index * 0.1, ease: "power2.out",
            scrollTrigger: {
              trigger: link,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(".contact-footer",
        { autoAlpha: 0 },
        {
          autoAlpha: 1, duration: 0.5,
          scrollTrigger: {
            trigger: ".contact-footer",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: sectionRef }
  );

  return (
    <Section id="contact">
      <ContactWrapper ref={sectionRef}>
        <Container>
          <Text variant="h1" align="center" className="contact-title">
            Vamos conversar?
          </Text>
          <ContactSubtitle className="contact-subtitle">
            Estou sempre aberto a novos desafios e oportunidades.
            Entre em contato por qualquer um dos canais abaixo.
          </ContactSubtitle>

          <LinksGrid>
            {links.map((link) => (
              <ContactLinkCard
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <LinkIcon>{link.icon}</LinkIcon>
                {link.label}
              </ContactLinkCard>
            ))}
          </LinksGrid>

          <Footer className="contact-footer">
            <FooterText>
              Paulo Ricardo Almeida &copy; {new Date().getFullYear()} — Feito com React, Three.js &amp; GSAP
            </FooterText>
          </Footer>
        </Container>
      </ContactWrapper>
    </Section>
  );
}
