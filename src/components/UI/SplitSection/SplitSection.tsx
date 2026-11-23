import type { ReactNode } from "react";
import { useReveal } from "~/hooks/useReveal";
import { Wrapper, Grid, Heading, Index, Title, Content } from "./styles";

interface SplitSectionProps {
  id: string;
  /** "01" */
  index: string;
  /** Rótulo curto ao lado do índice ("Products") */
  label: string;
  title: string;
  children: ReactNode;
}

/**
 * Seção do handoff: borda superior, título na primeira coluna
 * ("01 / Products" + H2) e conteúdo ocupando as outras duas.
 */
export default function SplitSection({ id, index, label, title, children }: SplitSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <Wrapper id={id} ref={ref} aria-labelledby={`${id}-title`}>
      <Grid>
        <Heading className="reveal">
          <Index>
            {index} / {label}
          </Index>
          <Title id={`${id}-title`}>{title}</Title>
        </Heading>
        <Content className="reveal">{children}</Content>
      </Grid>
    </Wrapper>
  );
}
