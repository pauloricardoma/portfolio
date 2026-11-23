/**
 * Config própria do Vitest: NÃO herda o vite.config.ts (plugins do React
 * Router, Netlify e Babel são para o app, não para teste de lógica pura).
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
