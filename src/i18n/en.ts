import type { IDictionary } from "./types";

const en: IDictionary = {
  meta: {
    companyTitle: "PRMA Code — Software studio",
    companyDescription:
      "PRMA Code is a software studio. We build our own digital products and develop mobile and web apps for clients.",
    portfolioTitle: "Paulo Ricardo Almeida — Software Engineer | PRMA Code",
    portfolioDescription:
      "Portfolio of Paulo Ricardo Almeida, founder of PRMA Code and a software engineer specializing in React, TypeScript, React Native and Node.js.",
  },
  header: {
    products: "Products",
    services: "Services",
    founder: "Founder",
    contact: "Contact",
    portfolio: "Portfolio",
    home: "Home",
    projects: "Projects",
    skills: "Skills",
    menu: "Menu",
    language: "Language",
    toggleTheme: "Switch theme",
    themeLight: "Light",
    themeDark: "Dark",
    companySite: "PRMA Code ↗",
  },
  company: {
    hero: {
      kicker: "Software studio",
      subtitle:
        "PRMA Code is a software studio. We build our own digital products and develop mobile and web apps for clients.",
      ctaPrimary: "Talk about a project →",
      ctaSecondary: "See what we're building",
    },
    products: {
      label: "Products",
      title: "What we're building.",
      status: {
        "coming-soon": "Coming soon",
        live: "Available",
      },
    },
    services: {
      label: "Services",
      title: "Client projects",
      text: "Alongside our own products, we build mobile and web apps for clients, end to end: from planning and design to launch on the App Store and Google Play.",
      steps: ["Planning", "Design", "Development", "App Store & Google Play"],
      cta: "Talk about a project →",
    },
    founder: {
      label: "Founder",
      title: "Who's behind it",
      text: "PRMA Code was founded by Paulo Ricardo Almeida, a software engineer who builds web and mobile applications with React, React Native, TypeScript and Node.js.",
      cta: "View portfolio →",
    },
    contact: {
      label: "Contact",
      title: "Get in touch",
      subtitle: "Have a project in mind, or questions about our products? Email us at:",
    },
    footer: {
      copyright: (year) => `© ${year} PRMA Code`,
      cnpjLabel: "CNPJ",
    },
  },
  portfolio: {
    hero: {
      eyebrow: (name) => `${name} · Founder, PRMA Code`,
      titleStart: "Software",
      titleEnd: "Engineer",
      subtitle:
        "Specialized in building complex web and mobile applications with React, TypeScript and Node.js, from solution design all the way to production.",
      ctaProjects: "See projects ↓",
      ctaContact: "Get in touch",
    },
    projects: {
      label: "Projects",
      title: "Selected work",
      counter: (current, total) =>
        `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
      carouselLabel: "Projects",
      carouselRole: "carousel",
      goTo: (name) => `Go to project ${name}`,
      previous: "Previous project",
      next: "Next project",
      metricsLabel: "Results",
      platform: {
        web: "Web",
        mobile: "iOS · Android",
      },
      screenshotAlt: (name) => `Screenshot of ${name}`,
    },
    skills: {
      label: "Skills",
      title: "Stack",
    },
    contact: {
      label: "Contact",
      title: "Let's talk",
      subtitle:
        "I'm always open to new challenges and opportunities. Reach out through any of the channels below.",
      email: "Email",
    },
    footer: {
      profileOf: "A PRMA Code profile",
    },
  },
  errors: {
    title: "Error",
    notFound: "The page you're looking for doesn't exist.",
    unexpected: "Something went wrong.",
  },
};

export default en;
