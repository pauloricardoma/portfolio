import Header from "~/components/Shell/Header/Header";
import Footer from "~/components/Shell/Footer/Footer";
import { usePortfolio } from "./usePortfolio";
import HeroSection from "./components/HeroSection/HeroSection";
import ProjectsSection from "./components/ProjectsSection/ProjectsSection";
import SkillsSection from "./components/SkillsSection/SkillsSection";
import ContactSection from "./components/ContactSection/ContactSection";

export default function Portfolio() {
  const {
    t,
    founderName,
    navItems,
    projects,
    activeIndex,
    goTo,
    goNext,
    goPrev,
    skillCategories,
    contactLinks,
    footer,
  } = usePortfolio();

  return (
    <>
      <Header navItems={navItems} logoHref="/" />
      <main>
        <HeroSection texts={t.hero} name={founderName} />
        <ProjectsSection
          index="01"
          texts={t.projects}
          projects={projects}
          activeIndex={activeIndex}
          onSelect={goTo}
          onPrev={goPrev}
          onNext={goNext}
        />
        <SkillsSection index="02" texts={t.skills} categories={skillCategories} />
        <ContactSection index="03" texts={t.contact} links={contactLinks} />
      </main>
      <Footer left={footer.left} right={footer.right} />
    </>
  );
}
