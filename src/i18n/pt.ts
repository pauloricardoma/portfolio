import type { IDictionary } from "./types";

const pt: IDictionary = {
  meta: {
    companyTitle: "PRMA Code — Estúdio de software",
    companyDescription:
      "A PRMA Code é um estúdio de software. Criamos nossos próprios produtos digitais e desenvolvemos apps mobile e web para clientes.",
    portfolioTitle: "Paulo Ricardo Almeida — Engenheiro de Software | PRMA Code",
    portfolioDescription:
      "Portfólio de Paulo Ricardo Almeida, fundador da PRMA Code e engenheiro de software especialista em React, TypeScript, React Native e Node.js.",
  },
  header: {
    products: "Produtos",
    services: "Serviços",
    founder: "Quem faz",
    contact: "Contato",
    portfolio: "Portfólio",
    home: "Início",
    projects: "Projetos",
    skills: "Skills",
    menu: "Menu",
    language: "Idioma",
    switchTheme: (toDark) => `Mudar para tema ${toDark ? "escuro" : "claro"}`,
  },
  company: {
    hero: {
      kicker: "Estúdio de software",
      subtitle:
        "A PRMA Code é um estúdio de software. Criamos nossos próprios produtos digitais e desenvolvemos apps mobile e web para clientes.",
      scroll: "Scroll",
    },
    products: {
      title: "Produtos",
      intro: "O que estamos construindo.",
      status: {
        "coming-soon": "Em breve",
        live: "Disponível",
      },
    },
    services: {
      title: "Projetos para clientes",
      text: "Além dos produtos próprios, desenvolvemos apps mobile e web para clientes, de ponta a ponta: do planejamento e design à publicação na App Store e no Google Play.",
      cta: "Falar sobre um projeto",
    },
    founder: {
      title: "Quem faz",
      label: "Fundador",
      text: "A PRMA Code foi fundada por Paulo Ricardo Almeida, engenheiro de software que desenvolve aplicações web e mobile com React, React Native, TypeScript e Node.js.",
      cta: "Ver portfólio →",
    },
    contact: {
      title: "Contato",
      subtitle: "Tem um projeto em mente ou dúvidas sobre nossos produtos? Escreva para:",
    },
    footer: {
      cnpjLabel: "CNPJ",
    },
  },
  portfolio: {
    hero: {
      title: "Software Engineer",
      subtitle:
        "Especialista em construção de aplicações web e mobile de alta complexidade com React, TypeScript e Node.js — do desenho da solução à entrega em produção.",
      scroll: "Scroll",
    },
    projects: {
      title: "Projetos",
      view: (name) => `Ver projeto ${name}`,
      previous: "Projeto anterior",
      next: "Próximo projeto",
    },
    skills: {
      title: "Skills",
    },
    contact: {
      title: "Vamos conversar?",
      subtitle:
        "Estou sempre aberto a novos desafios e oportunidades. Entre em contato por qualquer um dos canais abaixo.",
      madeWith: "Feito com React, Three.js & GSAP",
    },
  },
  errors: {
    title: "Erro",
    notFound: "A página solicitada não foi encontrada.",
    unexpected: "Ocorreu um erro inesperado.",
  },
};

export default pt;
