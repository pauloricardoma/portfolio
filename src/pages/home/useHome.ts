/**
 * useHome.ts — ViewModel da Home (padrão MVVM).
 *
 * Dados reais extraídos do CV de Paulo Ricardo Almeida.
 * Três projetos baseados nas empresas: Coordly, La Fabrique, Codemobile.
 */
import { useState, useCallback } from "react";
import type { IProject } from "~/interfaces/home/IProject";
import type { ISkillCategory } from "./components/SkillsSection/SkillCategory";

const projects: IProject[] = [
  {
    id: "coordly",
    name: "Coordly",
    description:
      "Plataforma SaaS de gestão com +400k itens renderizados. Resolvi gargalos críticos de performance com virtualização e memoização, reduzi ~50% do consumo de memória. Migrei arquitetura de Redux para React Query e desenvolvi componente interno para Autodesk Viewer 3D.",
    techs: ["React", "TypeScript", "Styled Components", "React Query", "Redux", "Autodesk Viewer 3D"],
    type: "web",
    screenshot: "/projects/webapp.png",
  },
  {
    id: "la-fabrique",
    name: "La Fabrique Flottante",
    description:
      "App mobile internacional com chat realtime, módulos nativos Android/iOS e microsserviços Firebase. Diagnostiquei e corrigi gargalos críticos de performance no Android, desenvolvi sistema de chat escalável e módulos nativos para funcionalidades inexistentes no ecossistema React Native.",
    techs: ["React Native", "TypeScript", "Firebase", "Node.js", "Kotlin", "Módulos Nativos"],
    type: "mobile",
    screenshot: "/projects/app1.png",
  },
  {
    id: "codemobile",
    name: "Codemobile",
    description:
      "Múltiplos projetos fullstack e mobile: APIs REST com NestJS, serverless com Firebase Functions, integração de pagamentos Stripe, módulo nativo Android para chamadas SIM e publicação contínua nas stores.",
    techs: ["Next.js", "NestJS", "React Native", "Firebase", "PostgreSQL", "Stripe"],
    type: "mobile",
    screenshot: "/projects/app2.png",
  },
];

/**
 * Skills organizadas por categoria — baseadas no stack real do CV.
 */
const skillCategories: ISkillCategory[] = [
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
      "Android Nativo",
      "Firebase Push",
      "Módulos Nativos",
      "Publicação Stores",
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
    name: "3D & Animação",
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
    name: "Arquitetura",
    icon: "🏗️",
    proficiency: 85,
    skills: [
      "Design Patterns",
      "Microsserviços",
      "Refatoração Legados",
      "Performance",
      "Virtualização",
      "Code Review",
    ],
  },
  {
    name: "Integrações",
    icon: "🔗",
    proficiency: 80,
    skills: [
      "Stripe",
      "Firebase Auth",
      "Realtime / WebSocket",
      "CSP / Segurança",
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
    href: "https://github.com/pauloricardoma",
    icon: "🐙",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pauloricardoma/",
    icon: "💼",
  },
];

export function useHome() {
  const [focusedProjectIndex, setFocusedProjectIndex] = useState(0);

  const handleFocusChange = useCallback((index: number) => {
    setFocusedProjectIndex(index);
  }, []);

  const sections = ["hero", "projects", "skills", "contact"] as const;

  return {
    sections,
    projects,
    focusedProjectIndex,
    handleFocusChange,
    skillCategories,
    contactLinks,
  };
}
