# ADR 0003 — Tema por variáveis CSS, script pré-pintura e ids estáveis do styled-components

- **Status:** aceito
- **Data:** 23/11/2026
- **Vale para:** o site inteiro (tema, cores e estilos de todas as páginas).
- **Spec / plano:** spec 0005, plano 04.

## Contexto

O tema antigo trocava o objeto do `ThemeProvider` no cliente. O SSR não sabe o tema do visitante, então sempre saía escuro, e quem usava o claro via a página piscar escura. Com a identidade nova (claro e escuro do handoff), isso piora.

Na mesma revisão apareceu um segundo problema: o styled-components numera os componentes na ordem em que os módulos carregam. O build do servidor carrega todas as rotas e o cliente só a aberta, então no `/portfolio` as classes do SSR e do cliente divergiam (erro de hidratação que o React não corrige). Isso já acontecia em produção desde que a home entrou.

## Decisão

1. **Um objeto de tema só**, com valores `var(--bg)`, `var(--ink)` etc. (`src/styles/themes/theme.ts`). As variáveis são definidas em `global.ts` por `:root[data-theme="light|dark"]`, com `prefers-color-scheme` como padrão sem JS.
2. **Script inline no `<head>`** (`src/styles/themeScript.ts`), antes da pintura: lê `localStorage.theme` (só aceita `light`/`dark`), define `data-theme` e alinha a `<meta name="theme-color">`. O `<html>` leva `suppressHydrationWarning`.
3. **O que muda com o tema vai pelo CSS**, não pelo estado React. Exemplo: o rótulo do botão de tema usa as classes `only-light`/`only-dark`. O `themeMode` do `ThemeContext` só é confiável depois de montar.
4. **Tokens também em hex** (`src/styles/tokens.ts`, `colors.light|dark|contact`) para o que não lê `var(--…)`: Three.js, interpolação no GSAP e o próprio script.
5. **`babel-plugin-styled-components`** (via `vite-plugin-babel`, só em `src/`, devDependencies) com `ssr: true`, para os ids de classe serem estáveis por arquivo. Nomes legíveis só em dev.

## Alternativas consideradas

- **Tema em cookie, lido no SSR:** resolve o piscar, mas cria cookie (exige revisão de LGPD pela `seguranca.md`) e deixa o HTML variar por visitante (pior para cache).
- **Esconder a página até o JS decidir o tema:** piora o LCP.
- **Plugin Vite próprio para os ids** (regex adicionando `withConfig`): sem dependência, mas é código frágil para manter. O plugin Babel é a solução padrão.

## Consequências

- Trocar o tema não re-renderiza a árvore; o CSS faz o trabalho.
- Quando a CSP entrar (spec 0003), o script inline precisa de hash `sha256` no `script-src`, recalculado a cada mudança nele (anotado no `docs/specs/README.md`).
- Componente que precisar de cor em JS usa `tokens.colors[themeMode]`, sabendo que no SSR o valor é o claro.
- Três devDependencies novas: `babel-plugin-styled-components`, `vite-plugin-babel`, `@babel/core@7`. Nada vai para o bundle do cliente.
