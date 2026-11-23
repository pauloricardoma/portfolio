# ADR 0001 — Manter React Router v7 com SSR em vez de Astro

- **Status:** aceito
- **Data:** 22/11/2026
- **Vale para:** o site inteiro (página da empresa e portfólio). Não vale para as landings dos produtos (NEXGG tem projeto próprio e segue o padrão do kit).
- **Spec / plano:** —

## Contexto

O padrão do kit para site institucional é Astro estático, em monorepo com `apps/site`. Este projeto é anterior ao kit: um portfólio em React Router v7 com SSR, styled-components, GSAP e React Three Fiber, hospedado na Netlify. Em 22/11/2026 ele virou o site da PRMA Code, e a meta é boa posição no Google.

Medição do build em 22/11/2026: a página da empresa carrega cerca de 160 KB gzip de JS; o Three.js (235 KB gzip) fica só no `/portfolio`, em chunk lazy.

## Decisão

Manter a stack atual, sem monorepo e sem `kit-gen`:

- React Router v7 framework mode, SSR, React 19, TypeScript.
- styled-components, GSAP + ScrollTrigger, React Three Fiber (só no portfólio).
- Yarn 1. Deploy na Netlify com `@netlify/vite-plugin-react-router`.
- i18n próprio por rota (`src/i18n`), sem biblioteca.

O SEO vem do SSR: o HTML de cada página já sai com conteúdo, title, description, canonical, hreflang, Open Graph e JSON-LD.

## Alternativas consideradas

- **Astro estático (padrão do kit):** quase zero de JS e melhores Core Web Vitals. Não compensa agora: o ganho de posição para as buscas desta página é pequeno (conteúdo e links pesam mais que velocidade), a migração custaria dias, e o carrossel 3D e as animações virariam ilhas de React. Reavaliar se surgir rotina de conteúdo (blog, muitas páginas).
- **Cloudflare Pages + Workers:** também grátis e o domínio já está lá. Sem motivo para mudar agora; reavaliar quando o domínio do NEXGG for comprado na Cloudflare.
- **Next.js:** troca de framework sem ganho sobre o SSR atual.

## Consequências

- Mais fácil: nada a migrar; o 3D e as animações continuam como estão.
- Mais difícil: mais JS que um site Astro. O LCP precisa de cuidado, porque o texto do hero não pode depender do GSAP para aparecer (spec 0001).
- O `kit-gen` e o `kit-doctor` não se aplicam; o Hefesto entra pelos docs, specs, planos e settings.
- Toda rota nova precisa de `meta()` via `buildMeta` e de entrada no `sitemap.xml`.
