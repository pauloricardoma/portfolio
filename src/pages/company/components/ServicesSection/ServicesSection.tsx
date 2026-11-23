import SplitSection from "~/components/UI/SplitSection/SplitSection";
import UnderlineLink from "~/components/UI/UnderlineLink/UnderlineLink";
import type { IDictionary } from "~/i18n/types";
import { ServicesLead, Steps, Step, StepNumber, StepTitle } from "./styles";

interface ServicesSectionProps {
  index: string;
  texts: IDictionary["company"]["services"];
  email: string;
}

export default function ServicesSection({ index, texts, email }: ServicesSectionProps) {
  return (
    <SplitSection id="services" index={index} label={texts.label} title={texts.title}>
      <ServicesLead>{texts.text}</ServicesLead>

      <Steps>
        {texts.steps.map((step, i) => (
          <Step key={step}>
            <StepNumber>{String(i + 1).padStart(2, "0")}</StepNumber>
            <StepTitle>{step}</StepTitle>
          </Step>
        ))}
      </Steps>

      <UnderlineLink href={`mailto:${email}`}>{texts.cta}</UnderlineLink>
    </SplitSection>
  );
}
