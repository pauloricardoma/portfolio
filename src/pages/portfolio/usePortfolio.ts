import { useState, useCallback, useMemo } from "react";
import type { IProject, IProjectData, MaybeLocalized } from "~/interfaces/portfolio/IProject";
import type { ISkillCategory, ISkillCategoryData } from "~/interfaces/portfolio/ISkillCategory";
import type { IContactLink } from "~/interfaces/portfolio/IContactLink";
import type { INavItem } from "~/interfaces/shell/INavItem";
import type { Locale } from "~/i18n/types";
import { useLocale } from "~/hooks/useLocale";
import { COMPANY } from "~/config/company";

const resolve = (value: MaybeLocalized, locale: Locale) =>
  typeof value === "string" ? value : value[locale];

const projects: IProjectData[] = [
  {
    id: "coordly",
    name: "Coordly",
    kind: { en: "SaaS management platform", pt: "Plataforma SaaS de gestão" },
    description: {
      en: "SaaS management platform rendering 400k+ items. I fixed critical performance bottlenecks with virtualization and memoization, cutting memory usage by roughly 50%. I also migrated the architecture from Redux to React Query and built an internal component for the Autodesk 3D Viewer.",
      pt: "Plataforma SaaS de gestão com +400k itens renderizados. Resolvi gargalos críticos de performance com virtualização e memoização, reduzi ~50% do consumo de memória. Migrei arquitetura de Redux para React Query e desenvolvi componente interno para Autodesk Viewer 3D.",
    },
    techs: ["React", "TypeScript", "Styled Components", "React Query", "Redux", "Autodesk Viewer 3D"],
    type: "web",
    screenshot: "/projects/webapp.png",
    metrics: [
      {
        value: { en: "400k+", pt: "+400k" },
        label: { en: "items rendered", pt: "itens renderizados" },
      },
      {
        value: { en: "~50%", pt: "~50%" },
        label: { en: "less memory usage", pt: "menos consumo de memória" },
      },
    ],
  },
  {
    id: "la-fabrique",
    name: "La Fabrique Flottante",
    kind: { en: "International mobile app", pt: "App mobile internacional" },
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
    kind: { en: "Full-stack and mobile projects", pt: "Projetos fullstack e mobile" },
    description: {
      en: "Several full-stack and mobile projects: REST APIs with NestJS, serverless backends on Firebase Functions, Stripe payment integration, a native Android module for SIM-based calls and continuous releases to the app stores.",
      pt: "Múltiplos projetos fullstack e mobile: APIs REST com NestJS, serverless com Firebase Functions, integração de pagamentos Stripe, módulo nativo Android para chamadas SIM e publicação contínua nas stores.",
    },
    techs: ["Next.js", "NestJS", "React Native", "Firebase", "PostgreSQL", "Stripe"],
    type: "mobile",
    screenshot: "/projects/app2.png",
  },
];

const skillCategories: ISkillCategoryData[] = [
  {
    name: "Frontend",
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
    skills: [
      "Design Patterns",
      { en: "Microservices", pt: "Microsserviços" },
      { en: "Legacy Refactoring", pt: "Refatoração Legados" },
      "Performance",
      { en: "Virtualization", pt: "Virtualização" },
      "Code Review",
    ],
  },
  {
    name: { en: "Integrations", pt: "Integrações" },
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

const FOUNDER_EMAIL = "pauloricardo.m.almeida@gmail.com";

export function usePortfolio() {
  const { locale, t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;

  /** Qualquer índice (inclusive negativo) vira um projeto válido: loop módulo n */
  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % total) + total) % total),
    [total]
  );
  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);

  const localizedProjects: IProject[] = useMemo(
    () =>
      projects.map((project) => ({
        id: project.id,
        name: project.name,
        kind: project.kind[locale],
        description: project.description[locale],
        techs: project.techs.map((tech) => resolve(tech, locale)),
        type: project.type,
        screenshot: project.screenshot,
        metrics: (project.metrics ?? []).map((metric) => ({
          value: metric.value[locale],
          label: metric.label[locale],
        })),
      })),
    [locale]
  );

  const localizedSkills: ISkillCategory[] = useMemo(
    () =>
      skillCategories.map((category) => ({
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
      { label: t.header.companySite, href: "/", kind: "route" },
    ],
    [t]
  );

  const contactLinks: IContactLink[] = useMemo(
    () => [
      { label: t.portfolio.contact.email, href: `mailto:${FOUNDER_EMAIL}`, external: false },
      { label: "GitHub", href: COMPANY.founder.github, external: true },
      { label: "LinkedIn", href: COMPANY.founder.linkedin, external: true },
    ],
    [t]
  );

  return {
    t: t.portfolio,
    founderName: COMPANY.founder.name,
    navItems,
    projects: localizedProjects,
    activeIndex,
    goTo,
    goNext,
    goPrev,
    skillCategories: localizedSkills,
    contactLinks,
    footer: {
      left: `${COMPANY.founder.name} © ${new Date().getFullYear()}`,
      right: t.portfolio.footer.profileOf,
    },
  };
}
