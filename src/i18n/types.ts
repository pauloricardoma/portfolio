export type Locale = "en" | "pt";

export type Localized<T> = Record<Locale, T>;

export interface IDictionary {
  meta: {
    companyTitle: string;
    companyDescription: string;
    portfolioTitle: string;
    portfolioDescription: string;
  };
  header: {
    products: string;
    services: string;
    founder: string;
    contact: string;
    portfolio: string;
    home: string;
    projects: string;
    skills: string;
    menu: string;
    language: string;
    /** aria-label do botão de tema (o rótulo visível vem de themeLight/themeDark) */
    toggleTheme: string;
    /** Rótulo do botão quando o tema atual é escuro (ação: ir para o claro) */
    themeLight: string;
    /** Rótulo do botão quando o tema atual é claro (ação: ir para o escuro) */
    themeDark: string;
    /** Link do portfólio para a home da empresa ("PRMA Code ↗") */
    companySite: string;
  };
  company: {
    hero: {
      kicker: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    /** Cada seção tem um rótulo curto (índice "01 / Products") e um título */
    products: {
      label: string;
      title: string;
      status: {
        "coming-soon": string;
        live: string;
      };
    };
    services: {
      label: string;
      title: string;
      text: string;
      steps: string[];
      cta: string;
    };
    founder: {
      label: string;
      title: string;
      text: string;
      cta: string;
    };
    contact: {
      label: string;
      title: string;
      subtitle: string;
    };
    footer: {
      copyright: (year: number) => string;
      cnpjLabel: string;
    };
  };
  portfolio: {
    hero: {
      /** "Paulo Ricardo Almeida · Founder, PRMA Code" */
      eyebrow: (name: string) => string;
      /** H1 em duas partes: a segunda sai em peso 400, seguida do cursor */
      titleStart: string;
      titleEnd: string;
      subtitle: string;
      ctaProjects: string;
      ctaContact: string;
    };
    projects: {
      label: string;
      title: string;
      /** "01 / 03" */
      counter: (current: number, total: number) => string;
      /** aria-label do palco */
      carouselLabel: string;
      /** aria-roledescription do palco */
      carouselRole: string;
      /** aria-label do dot e do aparelho */
      goTo: (name: string) => string;
      previous: string;
      next: string;
      /** aria-label da lista de métricas */
      metricsLabel: string;
      platform: {
        web: string;
        mobile: string;
      };
      /** alt da screenshot quando o 3D não roda */
      screenshotAlt: (name: string) => string;
    };
    skills: {
      label: string;
      title: string;
    };
    contact: {
      label: string;
      title: string;
      subtitle: string;
      email: string;
    };
    footer: {
      profileOf: string;
    };
  };
  errors: {
    title: string;
    notFound: string;
    unexpected: string;
  };
}
