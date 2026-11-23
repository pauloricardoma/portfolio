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
│   ├── UI/                   Text, Button, Container, Section, ColorPicker
│   ├── 3D/                   Scene, DevicePhone, DeviceLaptop, LaptopKeyboard
│   └── Shell/                Header (recebe navItems da page), LanguageToggle
├── i18n/                     types.ts (IDictionary, Locale, Localized), en.ts, pt.ts, locale.ts
├── config/                   company.ts, products.ts
├── seo/buildMeta.ts          metas, OG, hreflang, JSON-LD (Organization, Person)
├── hooks/                    useLocale, useReveal, useIsMobile
├── interfaces/               company/, portfolio/, shell/
├── styles/                   themes/, tokens.ts, global.ts
└── contexts/ThemeContext.tsx tema light/dark + cor primária (localStorage)
```

Páginas seguem MVVM: a View (`Company.tsx`) só monta as seções; o ViewModel (`useCompany.ts`) resolve idioma, dados e itens do header. Ver [`adr/0002-estrutura-de-features.md`](adr/0002-estrutura-de-features.md).

## 3. Dados

Sem banco. Textos em `src/i18n/{en,pt}.ts`; dados da empresa e produtos em `src/config/`; projetos e skills do portfólio em `usePortfolio.ts`. Preferências do visitante (tema e cor) só no `localStorage`.

## 4. Integrações

Nenhuma em runtime. Fontes servidas do próprio site. Build e hospedagem na Netlify; DNS na Cloudflare.

## 5. Segurança específica deste app

Sem dados de usuário. Os pontos de atenção (headers, dependências, contas) estão em [`seguranca.md`](seguranca.md).

## 6. Em aberto (técnico)

1. Hero depende do GSAP para aparecer (`visibility: hidden` até o JS rodar), o que atrasa o LCP. Spec 0001.
2. Header no celular com LanguageToggle + ColorPicker + tema + menu não foi testado em tela pequena. Spec 0002.
3. `yarn start` aponta para `build/server/index.js`, que o plugin da Netlify não gera. Spec 0003.
4. Página da empresa carrega ~160 KB gzip de JS (React, styled-components, GSAP, router). Aceito por ora; reavaliar se as métricas do Search Console apontarem problema.
