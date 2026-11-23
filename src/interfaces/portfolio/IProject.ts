import type { Localized } from "~/i18n/types";

/** Texto igual nos dois idiomas, ou { en, pt } quando muda */
export type MaybeLocalized = string | Localized<string>;

export type ProjectDevice = "mobile" | "web";

export interface IProjectMetric<T = string> {
  value: T;
  label: T;
}

/** Projeto como está nos dados (`usePortfolio`), com os textos nos dois idiomas */
export interface IProjectData {
  id: string;
  name: string;
  /** Tipo do projeto ("SaaS management platform") */
  kind: Localized<string>;
  description: Localized<string>;
  techs: MaybeLocalized[];
  type: ProjectDevice;
  screenshot: string;
  /** Só números que estão na descrição; sem métrica, a linha não aparece */
  metrics?: IProjectMetric<Localized<string>>[];
}

/** Projeto resolvido no idioma atual, para a View */
export interface IProject {
  id: string;
  name: string;
  kind: string;
  description: string;
  techs: string[];
  type: ProjectDevice;
  screenshot: string;
  metrics: IProjectMetric[];
}
