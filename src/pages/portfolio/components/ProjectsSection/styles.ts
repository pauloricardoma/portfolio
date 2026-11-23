import styled, { keyframes } from "styled-components";
import { borderRadius, layout, type } from "~/styles/tokens";

/** Grafite dos aparelhos do handoff (igual nos dois temas) */
const BEZEL = "#0D0D0C";

export const SectionWrapper = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  scroll-margin-top: 60px;
`;

export const SectionInner = styled.div`
  max-width: ${layout.container}px;
  margin: 0 auto;
  padding: ${layout.sectionPadding}px ${layout.gutter}px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Index = styled.span`
  font: ${type.eyebrow} ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;

export const Title = styled.h2`
  font: ${type.h2} ${({ theme }) => theme.font.sans};
  letter-spacing: ${type.h2Tracking};
`;

/* ---------- Controles (contador + setas) ---------- */

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Counter = styled.span`
  min-width: 64px;
  font: ${type.eyebrow} ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.colors.muted};
`;

export const RoundButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.ink};
  font: 500 16px ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

/* ---------- Palco ---------- */

export const Stage = styled.div`
  position: relative;
  height: clamp(420px, 48vw, 580px);
  overflow: hidden;
  border-radius: ${borderRadius.stage}px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.line};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }

  @media (hover: hover) {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
`;

/** Gradiente de piso nos 38% de baixo */
export const StageFloor = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 38%;
  background: linear-gradient(to top, ${({ theme }) => theme.colors.line}, transparent);
  opacity: 0.6;
  pointer-events: none;
`;

/** Ocupa o palco inteiro; o <canvas> do R3F estica até ele */
export const StageCanvas = styled.div`
  position: absolute;
  inset: 0;
`;

export const Dots = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
`;

/**
 * O traço visível tem 6px de altura; o botão tem 24px para ser fácil
 * de acertar no toque.
 */
export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 28 : 6)}px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  pointer-events: auto;
  transition: width 0.4s ease;

  &::before {
    content: "";
    display: block;
    height: 6px;
    border-radius: 3px;
    background: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.muted)};
    transition: background 0.4s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---------- Fallback sem WebGL ---------- */

export const FallbackFrame = styled.div`
  position: absolute;
  inset: 0 0 12% 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const FallbackDevice = styled.div<{ $device: "web" | "mobile" }>`
  width: ${({ $device }) => ($device === "web" ? "clamp(260px, 40vw, 520px)" : "clamp(140px, 16vw, 210px)")};
  max-width: 86%;
  aspect-ratio: ${({ $device }) => ($device === "web" ? "16 / 10" : "9 / 19")};
  max-height: 88%;
  padding: ${({ $device }) => ($device === "web" ? 10 : 8)}px;
  border-radius: ${({ $device }) => ($device === "web" ? "14px" : "clamp(24px, 3vw, 36px)")};
  background: ${BEZEL};
  box-shadow: 0 40px 60px -30px rgba(20, 20, 19, 0.45), inset 0 0 0 1px #2c2b29;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    border-radius: ${({ $device }) => ($device === "web" ? "6px" : "clamp(18px, 2.4vw, 29px)")};
  }
`;

/* ---------- Detalhes do projeto ativo ---------- */

const enter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

export const DetailsList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

export const Details = styled.article`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 32px;
  padding: 36px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  animation: ${enter} 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const DetailsHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProjectName = styled.h3`
  font: 600 32px/1.1 ${({ theme }) => theme.font.sans};
  letter-spacing: -0.03em;
`;

export const ProjectKind = styled.span`
  font: 400 15px ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
`;

export const DetailsBody = styled.div`
  grid-column: span 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Com uma coluna (2 × 300 + 32 + 2 × 24 de gutter), o span 2 criaria coluna implícita */
  @media (max-width: 679px) {
    grid-column: auto;
  }
`;

export const Metrics = styled.ul`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  list-style: none;
`;

export const MetricItem = styled.li`
  flex: 1 1 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 18px;
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${borderRadius.metric}px;
`;

export const MetricValue = styled.span`
  font: 600 28px ${({ theme }) => theme.font.sans};
  letter-spacing: -0.03em;
`;

export const MetricLabel = styled.span`
  font: 400 13px ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
`;

export const Description = styled.p`
  max-width: 640px;
  font: 400 17px/1.6 ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;
