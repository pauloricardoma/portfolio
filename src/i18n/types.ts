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
      title: string;
      subtitle: string;
      scroll: string;
    };
    projects: {
      title: string;
      view: (name: string) => string;
      previous: string;
      next: string;
    };
    skills: {
      title: string;
    };
    contact: {
      title: string;
      subtitle: string;
      madeWith: string;
    };
  };
  errors: {
    title: string;
    notFound: string;
    unexpected: string;
  };
}
