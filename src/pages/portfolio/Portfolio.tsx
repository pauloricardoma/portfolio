import { lazy, Suspense } from "react";
import Header from "~/components/Shell/Header/Header";
import { usePortfolio } from "./usePortfolio";
import HeroSection from "./components/HeroSection/HeroSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import ContactSection from "./components/ContactSection/ContactSection";
import { ProjectsFallback } from "./components/ProjectsSection/styles";

const ProjectsSection = lazy(
  () => import("./components/ProjectsSection/ProjectsSection")
);

export default function Portfolio() {
  const {
    t,
    founderName,
    navItems,
    projects,
    focusedProjectIndex,
    handleFocusChange,
    skillCategories,
    contactLinks,
  } = usePortfolio();

  return (
    <>
      <Header navItems={navItems} logoHref="/" />
      <main>
        <HeroSection texts={t.hero} name={founderName} />
        <Suspense fallback={<ProjectsFallback />}>
          <ProjectsSection
            texts={t.projects}
            projects={projects}
            focusedIndex={focusedProjectIndex}
            onFocusChange={handleFocusChange}
          />
        </Suspense>
        <SkillsSection title={t.skills.title} categories={skillCategories} />
        <ContactSection texts={t.contact} name={founderName} links={contactLinks} />
      </main>
    </>
  );
}
