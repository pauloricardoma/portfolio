# PRMA Code (site) — Arquitetura: site

> Começa curta e cresce com o projeto. Cada spec que muda a estrutura atualiza este arquivo.
> Última atualização: 22/11/2026.

## 1. Visão geral

App único com SSR (React Router v7 framework mode), hospedado na Netlify. O servidor renderiza o HTML completo de cada página (conteúdo, metas, JSON-LD) e o cliente hidrata para animações, troca de tema e o carrossel 3D. Não conversa com API, banco nem serviço externo.

### Por que React Router e não Astro

O padrão do kit para site é Astro estático. Este projeto já existia em React Router com SSR, o que entrega ao Google o mesmo HTML indexável; a migração custaria dias e o 3D do portfólio viraria ilha de React. Detalhes em [`adr/0001-stack.md`](adr/0001-stack.md).

## 2. Estrutura

```
src/
├── root.tsx                  Layout (html lang pela URL), ErrorBoundary
├── routes.ts                 / e /portfolio (en), /pt e /pt/portfolio (pt); mesmo módulo, ids diferentes
├── routes/                   company.tsx, portfolio.tsx: meta() via buildMeta + render da page
├── pages/
│   ├── company/              Company.tsx, useCompany.ts, components/{CompanyHero, ProductsSection,
│   │                         ServicesSection, FounderSection, CompanyContact}
│   └── portfolio/            Portfolio.tsx, usePortfolio.ts, components/{HeroSection, ProjectsSection,
│                             SkillsSection, ContactSection}
├── components/
│   ├── UI/                   Button, Chip, UnderlineLink, SplitSection
│   ├── Brand/                LogoMark (marca "P com cursor"), Cursor (cursor piscando)
│   ├── 3D/                   Scene (Canvas + medição de FPS), StudioLights (Lightformers), SceneEffects (bloom, lazy),
│   │                         DevicePhone/DeviceLaptop/DeviceScreen/LaptopKeyboard (procedurais, geometry.ts),
│   │                         FloorShadow, useSceneQuality (degradação), config.ts (limites e cores), WebGLBoundary
│   └── Shell/                Header (recebe navItems da page), LanguageToggle, Footer
├── i18n/                     types.ts (IDictionary, Locale, Localized), en.ts, pt.ts, locale.ts
├── config/                   company.ts, products.ts
├── seo/buildMeta.ts          metas, OG, hreflang, JSON-LD (Organization, Person)
├── hooks/                    useLocale, useReveal, useIsMobile, useReducedMotion, useWebGLSupport
├── interfaces/               company/, portfolio/, shell/
├── styles/                   tokens.ts (hex), themes/theme.ts (var(--…)), global.ts, themeScript.ts
└── contexts/ThemeContext.tsx tema light/dark (data-theme no <html> + localStorage)
```

Headers: o `entry.server` gera um nonce por requisição e define CSP, HSTS e os demais headers do HTML (`src/config/security.ts`, `NonceContext` no `root.tsx`); o `netlify.toml` define cache e headers dos estáticos. Ver [`adr/0005-csp-nonce-no-ssr.md`](adr/0005-csp-nonce-no-ssr.md).

Tema: variáveis CSS por `[data-theme]`, definidas por um script no `<head>` antes da pintura; ids do styled-components estáveis via `babel-plugin-styled-components`. Ver [`adr/0003-tema-por-variaveis-css.md`](adr/0003-tema-por-variaveis-css.md).

Páginas seguem MVVM: a View (`Company.tsx`) só monta as seções; o ViewModel (`useCompany.ts`) resolve idioma, dados e itens do header. Ver [`adr/0002-estrutura-de-features.md`](adr/0002-estrutura-de-features.md).

Carrossel do portfólio: a seção de projetos sai no SSR (palco, contador, setas, dots e detalhes). Só a cena Three.js (`ProjectsScene`) é `lazy()` e só monta se `useWebGLSupport` achar WebGL; um `WebGLBoundary` em volta troca para a screenshot se a cena quebrar. O projeto ativo mora no `usePortfolio` (`activeIndex`, loop módulo n); a cena recebe `activeIndex`, `onSelect` e cores em hex, e gira pelo caminho mais curto. O movimento (arraste com inércia e encaixe, classificação do gesto, ângulo ↔ índice) é matemática pura em `src/components/3D/carouselMath.ts`, testada com Vitest (`yarn test`); o `ProjectsCarousel` só aplica por frame. A cena pausa o render fora da tela (`frameloop`), entra uma vez por sessão (`sessionStorage`, chave `prma:carousel-entrance`, sem dado pessoal) e avisa trocas com `onSelect(index, "drag" | "click")`. Orçamento de bundle, pós-processamento e degradação por FPS: [`adr/0004-carrossel-threejs-orcamento-degradacao.md`](adr/0004-carrossel-threejs-orcamento-degradacao.md).

## 3. Dados

Sem banco. Textos em `src/i18n/{en,pt}.ts`; dados da empresa e produtos em `src/config/`; projetos e skills do portfólio em `usePortfolio.ts`. Preferência do visitante (tema) só no `localStorage`.

## 4. Integrações

Nenhuma em runtime. Fontes servidas do próprio site. Build e hospedagem na Netlify; DNS na Cloudflare.

## 5. Segurança específica deste app

Sem dados de usuário. Os pontos de atenção (headers, dependências, contas) estão em [`seguranca.md`](seguranca.md).

## 6. Em aberto (técnico)

1. Gesto de toque do carrossel (swipe vertical rola, horizontal gira) conferido só no desktop; falta o aparelho real.
2. Header no celular conferido em 390px (iframe) no plano 04; falta teste num aparelho real. Spec 0002.
3. Headers em produção (CSP, HSTS, cache dos estáticos) e regras do Cloudflare a conferir depois do deploy da spec 0003.
4. Página da empresa carrega ~160 KB gzip de JS (React, styled-components, GSAP, router). Aceito por ora; reavaliar se as métricas do Search Console apontarem problema.
