/**
 * Cena 3D do palco (carregada com lazy(): o Three.js só baixa no /portfolio
 * e só se o navegador tiver WebGL).
 */
import { Suspense } from "react";
import Scene from "~/components/3D/Scene";
import type { SelectSource } from "~/components/3D/carouselMath";
import { DEVICE_PALETTE, LIGHTS } from "~/components/3D/config";
import { useSceneQuality } from "~/components/3D/useSceneQuality";
import { useAppTheme } from "~/contexts/ThemeContext";
import useIsMobile from "~/hooks/useIsMobile";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import type { IProject } from "~/interfaces/portfolio/IProject";
import ProjectsCarousel from "./ProjectsCarousel";

interface ProjectsSceneProps {
  projects: IProject[];
  activeIndex: number;
  /** `source` diz se veio de arraste ou clique na cena */
  onSelect: (index: number, source?: SelectSource) => void;
}

export default function ProjectsScene({ projects, activeIndex, onSelect }: ProjectsSceneProps) {
  const { themeMode } = useAppTheme();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const quality = useSceneQuality();

  return (
    <Scene themeMode={themeMode} quality={quality}>
      {/* Texturas (screenshots) carregam com Suspense */}
      <Suspense fallback={null}>
        <ProjectsCarousel
          projects={projects}
          activeIndex={activeIndex}
          onSelect={onSelect}
          palette={DEVICE_PALETTE[themeMode]}
          orbitRadius={isMobile ? 3.4 : 3.2}
          laptopScale={isMobile ? 0.7 : 1}
          phoneScale={isMobile ? 0.85 : 1.1}
          reducedMotion={reducedMotion}
          shadows={quality.shadows}
          shadowOpacity={LIGHTS[themeMode].shadowOpacity}
        />
      </Suspense>
    </Scene>
  );
}
