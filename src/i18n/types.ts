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
    switchTheme: (toDark: boolean) => string;
  };
  company: {
    hero: {
      kicker: string;
      subtitle: string;
      scroll: string;
    };
    products: {
      title: string;
      intro: string;
      status: {
        "coming-soon": string;
        live: string;
      };
    };
    services: {
      title: string;
      text: string;
      cta: string;
    };
    founder: {
      title: string;
      label: string;
      text: string;
      cta: string;
    };
    contact: {
      title: string;
      subtitle: string;
    };
    footer: {
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
