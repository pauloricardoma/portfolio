export interface IProject {
  id: string;
  name: string;
  description: string;
  techs: string[];
  type: "mobile" | "web";
  screenshot: string;
  link?: string;
}
