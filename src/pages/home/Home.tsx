import { useHome } from "./useHome";
import HeroSection from "./components/HeroSection/HeroSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import ContactSection from "./components/ContactSection/ContactSection";
import { lazy, Suspense } from "react";
import { ProjectsFallback } from "./components/ProjectsSection/styles";

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
