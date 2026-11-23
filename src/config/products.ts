import type { IProduct } from "~/interfaces/company/IProduct";

/**
 * Nome provisório do app: troque aqui quando o nome for decidido
 * (pode ser o mesmo nos dois idiomas).
 */
const GAMING_APP_NAME = {
  en: "New app for gamers",
  pt: "Novo app para jogadores",
};

/** Para lançar um produto novo, adicione um item nesta lista. */
export const PRODUCTS: IProduct[] = [
  {
    id: "gaming-app",
    name: GAMING_APP_NAME,
    description: {
      en: "An app for finding people to play with. It matches players into duos and parties based on how they play: server, rank, role, schedule and playstyle.",
      pt: "Um app para encontrar pessoas para jogar. Ele forma duplas e parties por compatibilidade de jogo: servidor, elo, função, horário e estilo.",
    },
    // Critérios de compatibilidade, os mesmos da descrição
    tags: [
      { en: "Server", pt: "Servidor" },
      { en: "Rank", pt: "Elo" },
      { en: "Role", pt: "Função" },
      { en: "Schedule", pt: "Horário" },
      { en: "Playstyle", pt: "Estilo" },
    ],
    platforms: ["iOS", "Android"],
    status: "coming-soon",
  },
];
