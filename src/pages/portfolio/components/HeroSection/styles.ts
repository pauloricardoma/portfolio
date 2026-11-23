import styled, { keyframes } from "styled-components";
import { spacing, breakpoints } from "~/styles/tokens";

export const HeroWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

/**
 * HeroContent — container do conteúdo do hero.
 *
 * PERFORMANCE (CLS fix):
 * Os filhos usam gsap.from({ opacity: 0, y: 30 }), que funciona assim:
 * 1. React renderiza visível (opacity: 1)
 * 2. GSAP seta opacity: 0 instantaneamente
 * 3. GSAP anima de volta pra opacity: 1
 *
 * O passo 2 causa CLS porque o elemento "desaparece" e reaparece.
 *
 * Solução: setar visibility: hidden no CSS inicial.
 * O GSAP automaticamente seta visibility: inherit quando começa a animar.
 * Assim o elemento nunca "pisca" — nasce escondido e aparece suavemente.
 *
 * Usamos visibility: hidden (não opacity: 0) nos filhos porque:
 * - visibility: hidden → elemento invisible mas opacity continua 1
 * - GSAP autoAlpha: 0 lê opacity 1 e anima de 0 → 1 corretamente
 * - GSAP auto-seta visibility: inherit ao iniciar a animação
 *
 * Com opacity: 0 no CSS + gsap.from({ opacity: 0 }), o GSAP lê
 * o valor atual como 0 e anima de 0 → 0 (nada acontece!).
 */
export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${spacing.lg}px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${spacing.lg}px;

  .hero-name,
  .hero-accent,
  .hero-title,
  .hero-subtitle {
    visibility: hidden;
  }
`;

/**
 * HeroSubtitle — texto secundário do Hero.
 * Usa onSurfaceVariant (cor mais suave que onSurface)
 * pra criar hierarquia visual: título > subtítulo.
 */
export const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 600px;

  @media (min-width: ${breakpoints.tablet}px) {
    font-size: 20px;
  }
`;

/**
 * Accent line — linha decorativa com a cor primary.
 * Fica entre o nome e o título pra dar um toque visual.
 */
export const AccentLine = styled.div`
  width: 60px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;
`;

/**
 * ScrollIndicator — seta animada no rodapé do Hero.
 *
 * keyframes é como definimos animações CSS puras no styled-components.
 * bounce: move pra baixo (12px) e volta, com opacidade variando.
 * "infinite" = repete pra sempre.
 */
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(12px);
    opacity: 1;
  }
`;

/**
 * ScrollIndicator — visibility: hidden inicial pra sincronizar com GSAP autoAlpha.
 * Sem isso, o indicador pisca (visível → invisível → animado).
 */
export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: ${spacing.xl}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.sm}px;
  animation: ${bounce} 2s ease-in-out infinite;
  cursor: pointer;
  visibility: hidden;
`;

export const ScrollText = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.muted};
`;

/**
 * ScrollArrow — seta feita com CSS puro (borda rotacionada).
 * Mais leve que importar um ícone SVG, e se adapta às cores do tema.
 */
export const ScrollArrow = styled.div`
  width: 20px;
  height: 20px;
  border-right: 2px solid ${({ theme }) => theme.colors.muted};
  border-bottom: 2px solid ${({ theme }) => theme.colors.muted};
  transform: rotate(45deg);
`;
