import type { MaybeLocalized } from "./IProject";

export interface ISkillCategoryData {
  name: MaybeLocalized;
  skills: MaybeLocalized[];
}

export interface ISkillCategory {
  name: string;
  skills: string[];
}
