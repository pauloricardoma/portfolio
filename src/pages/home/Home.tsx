/**
 * Home.tsx — View da página Home (padrão MVVM).
 *
 * A View é "burra" — só renderiza componentes e passa dados.
 * Toda a lógica e estado vem do useHome (ViewModel).
 */
import { useHome } from "./useHome";
import HeroSection from "./components/HeroSection/HeroSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import ContactSection from "./components/ContactSection/ContactSection";
import { lazy, Suspense } from "react";
import { ProjectsFallback } from "./components/ProjectsSection/styles";

/** Code splitting: Three.js (~900KB) só carrega quando renderizado */
const ProjectsSection = lazy(
  () => import("./components/ProjectsSection/ProjectsSection")
);

export default function Home() {
  const {
    projects,
    focusedProjectIndex,
    handleFocusChange,
    skillCategories,
    contactLinks,
  } = useHome();

  return (
    <main>
      <HeroSection />
      {/**
       * Suspense fallback com altura calculada — CLS fix.
       *
       * O fallback precisa ter a MESMA altura que o ProjectsSection renderizado.
       * Senão, quando o chunk carrega e substitui o fallback, o conteúdo
       * abaixo (Skills, Contato) pula pra cima ou pra baixo → CLS.
       *
       * ProjectsFallback é um styled-component com alturas responsivas
       * que espelham as do CanvasContainer + padding da Section + info area.
       */}
      <Suspense fallback={<ProjectsFallback />}>
        <ProjectsSection
          projects={projects}
          focusedIndex={focusedProjectIndex}
          onFocusChange={handleFocusChange}
        />
      </Suspense>
      <SkillsSection categories={skillCategories} />
      <ContactSection links={contactLinks} />
    </main>
  );
}
