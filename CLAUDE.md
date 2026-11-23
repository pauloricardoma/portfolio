# PRMA Code — site da empresa

Site institucional da PRMA Code (`prmacode.dev`) com o portfólio do fundador em `/portfolio`. Em produção, mantido por uma pessoa. Objetivo: apresentar a empresa (programas de crédito para startups e clientes) e ranquear bem no Google.

## Documentação (ler antes de decidir algo)

- `docs/decisoes.md`: decisões de produto e negócio. **É a fonte da verdade.** Se o código divergir, pergunte antes de mudar qualquer um dos dois.
- `docs/produto.md`: visão, público e escopo.
- `docs/seguranca.md`: modelo de ameaças. Leia antes de adicionar formulário, analytics, cookies ou integração.
- `docs/arquitetura-site.md` e `docs/adr/`: arquitetura e decisões (inclusive por que **não** é Astro).
- `docs/specs/`: especificações. Toda mudança relevante entra como spec (`/hefesto:spec`) antes de virar plano.
- `.claude/plans/`: planos de execução (pasta ignorada pelo git, fica só local).

## Estrutura

Um app só, na raiz (não é monorepo). React Router v7 framework mode com SSR, React 19, styled-components, GSAP, Three.js (React Three Fiber), TypeScript. Yarn 1. Deploy na Netlify (`@netlify/vite-plugin-react-router`), build a cada push na `main`.

```
src/
├── routes.ts                 rotas manuais: / e /portfolio (en), /pt e /pt/portfolio (pt)
├── routes/                   entradas de rota: meta() + exportam a page
├── pages/<page>/             MVVM: Company.tsx / useCompany.ts, Portfolio.tsx / usePortfolio.ts, components/
├── components/{UI,3D,Shell}  reutilizáveis (Text, Button, Section…), 3D, Header + LanguageToggle
├── i18n/                     en.ts / pt.ts tipados por IDictionary, locale.ts (helpers de rota)
├── config/                   company.ts (e-mail, CNPJ), products.ts (lista de produtos)
├── seo/buildMeta.ts          title, description, canonical, hreflang, OG, Twitter, JSON-LD
├── hooks/                    useLocale, useReveal, useIsMobile
├── interfaces/               interfaces TS por feature
├── styles/                   themes/ (light/dark, ITheme), tokens.ts, global.ts
└── contexts/                 ThemeContext
public/                       og-image.png, robots.txt, sitemap.xml, fonts/, projects/
```

## Comandos

```bash
yarn dev         # dev server
yarn build       # build de produção (saída para a Netlify)
yarn typecheck   # typegen + tsc
```

`yarn start` não funciona com o plugin da Netlify (ver spec 0003).

## Regras de trabalho

- **Spec → plano → código.** Pedido novo vira spec (`/hefesto:spec`), spec aprovada vira plano (`/hefesto:plano`). Confirme antes de _iniciar_ um plano. Dentro de um plano aprovado, execute até o fim.
- **Dependências:** instalar lib é autônomo **só** para as libs listadas no plano aprovado. Lib nova no meio do caminho: pare e confirme.
- **Nada fora do repositório** sem confirmação. O Claude não lê nem escreve arquivos `.env*`.
- **Nada inventado no site:** sem números de clientes, depoimentos ou parceiros que não existem.
- **i18n:** nenhum texto visível fixo em componente. Tudo vai para `src/i18n/{en,pt}.ts`; dados traduzíveis usam `Localized<T>` (`{ en, pt }`). Inglês é o padrão (raiz), português em `/pt`. Sem redirecionamento por idioma do navegador.
- **SEO:** toda rota nova define `meta()` via `buildMeta` e entra no `public/sitemap.xml` nos dois idiomas.
- **Edite com Edit/Write, não pelo shell** (`sed -i`, `python3 - <<EOF`, `cat >`).
- Ao concluir um plano, atualize o status no `.claude/plans/README.md` e o da spec. Se alguma decisão mudar, atualize `docs/`.

## Convenções

- Código (identificadores, arquivos, commits) em inglês, exceto mensagens de commit, que seguem o histórico: Conventional Commits em português. Docs e specs em português.
- Um componente por arquivo: `ComponentName.tsx` + `styles.ts` na mesma pasta.
- styled-components (não Tailwind), transient props com `$`. Tokens em `src/styles/tokens.ts`, variantes com `color-mix()`.
- Animações com GSAP + ScrollTrigger (`useGSAP`). Elemento animado nasce com `visibility: hidden` e é revelado com `fromTo` + `autoAlpha` (nunca `from` com opacity). Para entrada ao rolar, use `useReveal` + classe `.reveal`.
- Three.js só no portfólio, carregado via `lazy()`.

## Armadilhas conhecidas

- `styled-components` e `gsap` precisam estar em `ssr.noExternal` no `vite.config.ts`, senão o SSR quebra.
- O mesmo módulo de rota é usado nos dois idiomas com `id` diferente em `routes.ts`; o idioma vem da URL (`getLocaleFromPath`).
- Depois de criar componentes novos com o dev rodando, o HMR pode acusar hydration mismatch de classes do styled-components. Reinicie o `yarn dev` antes de investigar.
- `.claude/` está no `.gitignore`: planos e settings não vão para o repositório.
