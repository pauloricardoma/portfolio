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
    switchTheme: (toDark) => `Switch to ${toDark ? "dark" : "light"} theme`,
  },
  company: {
    hero: {
      kicker: "Software studio",
      subtitle:
        "PRMA Code is a software studio. We build our own digital products and develop mobile and web apps for clients.",
      scroll: "Scroll",
    },
    products: {
      title: "Products",
      intro: "What we're building.",
      status: {
        "coming-soon": "Coming soon",
        live: "Available",
      },
    },
    services: {
      title: "Client projects",
      text: "Alongside our own products, we build mobile and web apps for clients, end to end: from planning and design to launch on the App Store and Google Play.",
      cta: "Talk about a project",
    },
    founder: {
      title: "Who's behind it",
      label: "Founder",
      text: "PRMA Code was founded by Paulo Ricardo Almeida, a software engineer who builds web and mobile applications with React, React Native, TypeScript and Node.js.",
      cta: "View portfolio →",
    },
    contact: {
      title: "Get in touch",
      subtitle: "Have a project in mind, or questions about our products? Email us at:",
    },
    footer: {
      cnpjLabel: "CNPJ (Brazilian company registration)",
    },
  },
  portfolio: {
    hero: {
      title: "Software Engineer",
      subtitle:
        "Specialized in building complex web and mobile applications with React, TypeScript and Node.js, from solution design all the way to production.",
      scroll: "Scroll",
    },
    projects: {
      title: "Projects",
      view: (name) => `View project ${name}`,
      previous: "Previous project",
      next: "Next project",
    },
    skills: {
      title: "Skills",
    },
    contact: {
      title: "Let's talk",
      subtitle:
        "I'm always open to new challenges and opportunities. Reach out through any of the channels below.",
      madeWith: "Built with React, Three.js & GSAP",
    },
  },
  errors: {
    title: "Error",
    notFound: "The page you're looking for doesn't exist.",
    unexpected: "Something went wrong.",
  },
};

export default en;
