import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    /**
     * noExternal: força o Vite a processar styled-components pelo pipeline SSR
     * em vez de tratá-lo como dependência externa (require do Node).
     *
     * Sem isso, o Vite tenta importar styled-components como ESM no SSR
     * mas o pacote exporta o "default" de forma que o `styled.p` fica undefined.
     * Ao colocar no noExternal, o Vite faz o bundle corretamente.
     */
    noExternal: ["styled-components"],
  },
});
