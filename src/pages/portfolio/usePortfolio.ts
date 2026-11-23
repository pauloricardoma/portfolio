import { useState, useCallback, useMemo } from "react";
import type { IProject } from "~/interfaces/portfolio/IProject";
import type { ISkillCategory } from "./components/SkillsSection/SkillCategory";
import type { INavItem } from "~/interfaces/shell/INavItem";
import type { Locale, Localized } from "~/i18n/types";
import { useLocale } from "~/hooks/useLocale";
import { COMPANY } from "~/config/company";

/** Texto igual nos dois idiomas, ou { en, pt } quando muda */
type MaybeLocalized = string | Localized<string>;

type LocalizedProject = Omit<IProject, "description" | "techs"> & {
  description: Localized<string>;
  techs: MaybeLocalized[];
};


type LocalizedSkillCategory = Omit<ISkillCategory, "name" | "skills"> & {
  name: MaybeLocalized;
  skills: MaybeLocalized[];
};

const resolve = (value: MaybeLocalized, locale: Locale) =>
  typeof value === "string" ? value : value[locale];

const projects: LocalizedProject[] = [
  {
    id: "coordly",
    name: "Coordly",
    description: {
      en: "SaaS management platform rendering 400k+ items. I fixed critical performance bottlenecks with virtualization and memoization, cutting memory usage by roughly 50%. I also migrated the architecture from Redux to React Query and built an internal component for the Autodesk 3D Viewer.",
      pt: "Plataforma SaaS de gestão com +400k itens renderizados. Resolvi gargalos críticos de performance com virtualização e memoização, reduzi ~50% do consumo de memória. Migrei arquitetura de Redux para React Query e desenvolvi componente interno para Autodesk Viewer 3D.",
    },
    techs: ["React", "TypeScript", "Styled Components", "React Query", "Redux", "Autodesk Viewer 3D"],
    type: "web",
    screenshot: "/projects/webapp.png",
  },
  {
    id: "la-fabrique",
    name: "La Fabrique Flottante",
    description: {
      en: "International mobile app with real-time chat, native Android/iOS modules and Firebase microservices. I diagnosed and fixed critical Android performance issues, built a scalable chat system and wrote native modules for features the React Native ecosystem didn't offer.",
      pt: "App mobile internacional com chat realtime, módulos nativos Android/iOS e microsserviços Firebase. Diagnostiquei e corrigi gargalos críticos de performance no Android, desenvolvi sistema de chat escalável e módulos nativos para funcionalidades inexistentes no ecossistema React Native.",
    },
    techs: ["React Native", "TypeScript", "Firebase", "Node.js", "Kotlin", { en: "Native Modules", pt: "Módulos Nativos" }],
    type: "mobile",
    screenshot: "/projects/app1.png",
  },
  {
    id: "codemobile",
    name: "Codemobile",
    description: {
      en: "Several full-stack and mobile projects: REST APIs with NestJS, serverless backends on Firebase Functions, Stripe payment integration, a native Android module for SIM-based calls and continuous releases to the app stores.",
      pt: "Múltiplos projetos fullstack e mobile: APIs REST com NestJS, serverless com Firebase Functions, integração de pagamentos Stripe, módulo nativo Android para chamadas SIM e publicação contínua nas stores.",
    },
    techs: ["Next.js", "NestJS", "React Native", "Firebase", "PostgreSQL", "Stripe"],
    type: "mobile",
    screenshot: "/projects/app2.png",
  },
];

const skillCategories: LocalizedSkillCategory[] = [
  {
    name: "Frontend",
    icon: "⚛️",
    proficiency: 95,
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Styled Components",
      "Redux",
      "React Query",
      "HTML/CSS",
    ],
  },
  {
    name: "Mobile",
    icon: "📱",
    proficiency: 90,
    skills: [
      "React Native",
      "Kotlin",
      { en: "Native Android", pt: "Android Nativo" },
      { en: "Native iOS", pt: "iOS Nativo" },
      "Firebase",
      { en: "Native Modules", pt: "Módulos Nativos" },
      { en: "App Store Releases", pt: "Publicação Stores" },
    ],
  },
  {
    name: "Backend",
    icon: "🔧",
    proficiency: 80,
    skills: [
      "Node.js",
      "NestJS",
      "Express",
      "REST APIs",
      "Firebase Functions",
      "PostgreSQL",
      "MongoDB",
      "Firestore",
    ],
  },
  {
    name: { en: "3D & Animation", pt: "3D & Animação" },
    icon: "🎨",
    proficiency: 70,
    skills: [
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "ScrollTrigger",
      "Autodesk Viewer",
      "CSS Animations",
    ],
  },
  {
    name: { en: "Architecture", pt: "Arquitetura" },
    icon: "🏗️",
    proficiency: 85,
    skills: [
      "Design Patterns",
      { en: "Microservices", pt: "Microsserviços" },
      { en: "Legacy Refactoring", pt: "Refatoração Legados" },
      "Performance",
      "Virtualização",
      "Code Review",
    ],
  },
  {
    name: { en: "Integrations", pt: "Integrações" },
    icon: "🔗",
    proficiency: 80,
    skills: [
      "Stripe",
      "Firebase Auth",
      "Realtime / WebSocket",
      { en: "CSP / Security", pt: "CSP / Segurança" },
      "CI/CD",
      "Git / Gitflow",
    ],
  },
];

const contactLinks = [
  {
    label: "Email",
    href: "mailto:pauloricardo.m.almeida@gmail.com",
    icon: "✉️",
  },
  {
    label: "GitHub",
    href: COMPANY.founder.github,
    icon: "🐙",
  },
  {
    label: "LinkedIn",
    href: COMPANY.founder.linkedin,
    icon: "💼",
  },
];

export function usePortfolio() {
  const { locale, t } = useLocale();
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(0);

  const handleFocusChange = useCallback((index: number) => {
    setFocusedProjectIndex(index);
  }, []);

  const localizedProjects: IProject[] = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        description: project.description[locale],
        techs: project.techs.map((tech) => resolve(tech, locale)),
      })),
    [locale]
  );

  const localizedSkills: ISkillCategory[] = useMemo(
    () =>
      skillCategories.map((category) => ({
        ...category,
        name: resolve(category.name, locale),
        skills: category.skills.map((skill) => resolve(skill, locale)),
      })),
    [locale]
  );

  const navItems: INavItem[] = useMemo(
    () => [
      { label: t.header.projects, href: "#projects", kind: "anchor" },
      { label: t.header.skills, href: "#skills", kind: "anchor" },
      { label: t.header.contact, href: "#contact", kind: "anchor" },
      { label: "PRMA Code", href: "/", kind: "route" },
    ],
    [t]
  );

  return {
    t: t.portfolio,
    founderName: COMPANY.founder.name,
    navItems,
    projects: localizedProjects,
    focusedProjectIndex,
    handleFocusChange,
    skillCategories: localizedSkills,
    contactLinks,
  };
}
