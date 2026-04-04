/**
 * IProject.ts — Interface dos projetos exibidos no carrossel 3D.
 *
 * Cada projeto tem um tipo de dispositivo (mobile ou web) que
 * determina qual modelo 3D será usado (DevicePhone ou DeviceLaptop).
 */

export interface IProject {
  id: string;
  name: string;
  description: string;
  /** Tecnologias usadas */
  techs: string[];
  /** Tipo determina o modelo 3D: "mobile" → celular, "web" → laptop */
  type: "mobile" | "web";
  /** Caminho do screenshot em /public/projects/ */
  screenshot: string;
  /** Link externo (opcional) */
  link?: string;
}
