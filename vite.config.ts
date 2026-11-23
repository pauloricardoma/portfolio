import { reactRouter } from "@react-router/dev/vite";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    /**
     * babel-plugin-styled-components: ids de classe estáveis por arquivo.
     * Sem ele, o styled-components numera os componentes na ordem em que os
     * módulos carregam. O servidor carrega todas as rotas e o cliente só a
     * aberta, então as classes divergem na hidratação (visto no /portfolio).
     * Só transforma o código do projeto (src/), não node_modules.
     */
    babel({
      include: /\/src\/.*\.[jt]sx?$/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: [
          [
            "babel-plugin-styled-components",
            // Nomes legíveis só em dev; em produção, classes curtas
            { ssr: true, displayName: mode !== "production", fileName: mode !== "production" },
          ],
        ],
      },
    }),
    reactRouter(),
    tsconfigPaths(),
    netlifyReactRouter(),
  ],
  ssr: {
    /**
     * noExternal: força o Vite a processar styled-components pelo pipeline SSR
     * em vez de tratá-lo como dependência externa (require do Node).
     *
     * Sem isso, o Vite tenta importar styled-components como ESM no SSR
     * mas o pacote exporta o "default" de forma que o `styled.p` fica undefined.
     * Ao colocar no noExternal, o Vite faz o bundle corretamente.
     */
    noExternal: ["styled-components", "gsap"],
  },
}));
