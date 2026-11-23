import type { IDictionary } from "~/i18n/types";
import { Controls, Counter, RoundButton } from "./styles";

interface CarouselControlsProps {
  texts: IDictionary["portfolio"]["projects"];
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CarouselControls({ texts, activeIndex, total, onPrev, onNext }: CarouselControlsProps) {
  return (
    <Controls>
      {/* O leitor de tela anuncia a troca de projeto por aqui */}
      <Counter aria-live="polite" aria-atomic="true">
        {texts.counter(activeIndex + 1, total)}
      </Counter>
      <RoundButton type="button" onClick={onPrev} aria-label={texts.previous}>
        <span aria-hidden="true">←</span>
      </RoundButton>
      <RoundButton type="button" onClick={onNext} aria-label={texts.next}>
        <span aria-hidden="true">→</span>
      </RoundButton>
    </Controls>
  );
}
