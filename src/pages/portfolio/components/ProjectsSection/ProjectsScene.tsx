/**
 * Cena 3D do palco (carregada com lazy(): o Three.js só baixa no /portfolio
 * e só se o navegador tiver WebGL).
 */
import { Suspense } from "react";
import Scene from "~/components/3D/Scene";
import { useAppTheme } from "~/contexts/ThemeContext";
import useIsMobile from "~/hooks/useIsMobile";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import type { IProject } from "~/interfaces/portfolio/IProject";
import { colors } from "~/styles/tokens";
import ProjectsCarousel from "./ProjectsCarousel";

interface ProjectsSceneProps {
  projects: IProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** Carcaça grafite nos dois temas (como no handoff); a luz é que muda com o tema */
const DEVICE_COLOR = colors.dark.line;

export default function ProjectsScene({ projects, activeIndex, onSelect }: ProjectsSceneProps) {
  const { themeMode } = useAppTheme();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  return (
    <Scene themeMode={themeMode}>
      {/* Texturas (screenshots) carregam com Suspense */}
      <Suspense fallback={null}>
        <ProjectsCarousel
          projects={projects}
          activeIndex={activeIndex}
          onSelect={onSelect}
          deviceColor={DEVICE_COLOR}
          dragEnabled={!isMobile}
          orbitRadius={isMobile ? 3.8 : 3.2}
          laptopScale={isMobile ? 0.85 : 1.0}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Scene>
  );
}
