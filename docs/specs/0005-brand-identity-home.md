# Spec 0005 — Identidade visual: base da marca e home

- **Status:** concluída
- **Pedido original:** "Beleza, começa no docs/design_handoff_prma_code_brand_site/README.md" (spec 0005 do backlog: refatoração da identidade visual)
- **Data:** 23/11/2026
- **Planos:** 04

## 1. Problema

O site usa a identidade antiga (azul, Inter, sem marca gráfica). Já existe uma marca aprovada ("P com cursor") e o redesign da home em alta fidelidade no handoff `docs/design_handoff_prma_code_brand_site/`. Esta spec aplica a base da marca (tokens, fontes, logo, favicon, OG, header, footer e tema) e a nova home. O `/portfolio` fica com a spec 0006, e o carrossel 3D com a 0007.

## 2. Comportamento esperado

Referência visual: `design_files/PRMA Code Site.dc.html`, recriado em React com os padrões do projeto e fiel ao handoff (cores, tipografia, espaçamentos, interações).

1. **Header** (sticky, fundo da página, borda inferior): marca de 30px + wordmark "PRMA Code" (18px), nav (Products, Services, Founder, Contact, Portfolio) em Geist 14px muted, toggle EN/PT segmentado (ativo preenchido com ink) e botão de tema (32px, mono 12px, rótulo "Dark"/"Light", traduzido). O seletor de cor sai. Abaixo de ~700px, a nav recolhe no botão de menu existente.
2. **Hero:** eyebrow "Software studio" com quadrado laranja de 8px; H1 "PRMA Code" (segunda palavra em 400) com cursor laranja piscando; lead; botão primário "Talk about a project →" (laranja, mailto `contato@prmacode.dev`) e secundário "See what we're building" (âncora `#products`).
3. **01 / Products:** card do app de jogos com pill "Coming soon" com cursor piscando, descrição, chips de critérios (Server, Rank, Role, Schedule, Playstyle) e rodapé iOS / Android.
4. **02 / Services · Client projects:** linha de abertura, faixa de 4 passos (Planning, Design, Development, App Store & Google Play) com divisórias de 1px, link "Talk about a project →" com sublinhado laranja de 2px.
5. **03 / Founder · Who's behind it:** nome, bio, chips de stack (React, React Native, TypeScript, Node.js), link "View portfolio →".
6. **04 / Contact** (faixa sempre escura): "Get in touch", texto, e-mail em Geist Mono `clamp(24px,4vw,44px)` com cursor; o e-mail fica laranja no hover.
7. **Footer:** marca de 22px + "© {ano} PRMA Code" · "CNPJ 45.056.853/0001-83" nos dois idiomas (o "Brazilian company registration" sai, decisão do usuário em 23/11/2026).
8. **Tema:** claro e escuro com os tokens do handoff e transição de 0,2s em fundo e cor. Sem preferência salva, segue o sistema. A escolha é salva no `localStorage` (chave `theme`, como hoje).

### Erros e casos de borda

| Situação | O que acontece | `code` devolvido |
| --- | --- | --- |
| Usuário com tema claro salvo abre a página | Já pinta claro, sem piscar escuro (hoje o SSR sai escuro e troca no cliente) | — |
| `prefers-reduced-motion: reduce` | Cursores ficam estáticos (visíveis, sem piscar); reveals sem movimento | — |
| JS desligado | Conteúdo visível (fallback `noscript` do `.reveal` mantido); tema segue o sistema | — |
| `localStorage` com `primaryColor` antigo | Ignorado e removido na primeira visita | — |
| Fonte ainda carregando | `font-display: swap` com fallback de sistema métrico próximo | — |

## 3. Regras de negócio

- Os textos vêm do site atual; nada inventado. Os chips de critérios saem da descrição atual do produto; os passos de serviço, do texto atual de serviços; a stack do fundador, da bio atual.
- Os chips de critérios ficam em `src/config/products.ts` (por produto, `Localized`), não fixos no componente.
- O laranja `#E8743B` é para marcas, cursores, botões e sublinhados, nunca para texto pequeno em fundo claro. Texto sobre o laranja é `#141413`.
- O ano do copyright vem de `new Date().getFullYear()` (risco de divergência SSR/cliente só na virada do ano, aceito).
- Hover de links: no tema escuro o texto fica laranja; no claro, o texto fica em `ink` com sublinhado laranja de 2px (laranja em texto pequeno sobre `#FAFAF8` não passa no AA). O e-mail grande do contato fica laranja nos dois, porque está na faixa escura e em tamanho grande.

## 4. Contratos

Sem API. Mudanças estruturais no front:

- `src/styles/themes/*` e `ITheme`: trocar a paleta Material antiga pelos tokens do handoff (`bg`, `ink`, `muted`, `line`, `card`, `accent`, `onAccent` e os da faixa de contato). O tema é exposto como **variáveis CSS** em `:root[data-theme="light|dark"]`; o `ThemeProvider` passa referências `var(--…)`, o que evita trocar o objeto do tema no cliente.
- Script inline curto no `<head>` (`root.tsx`), escrito no repositório, que define `data-theme` antes da pintura (`localStorage`, aceitando só `light`/`dark`, ou `prefers-color-scheme`) e atualiza a `<meta name="theme-color">`. Sem dado externo. O `<html>` leva `suppressHydrationWarning`.
- Os mesmos tokens também são exportados em JS por modo (`tokens.colors.light|dark`, hex resolvido) para o que não lê `var(--…)`: Three.js (0006/0007) e interpolação no GSAP. O `ThemeContext` expõe `themeMode`, que só é confiável depois de montar.
- O rótulo do botão de tema ("Dark"/"Light") e qualquer outra diferença visual entre temas sai por CSS (`[data-theme]`), não por estado React, para não divergir na hidratação.
- `src/styles/tokens.ts`: escala de tipografia, raios (6, 8, 10, 12, 14–16, 20, 999), container de 1160px e padding de seção de 96px.
- Componentes novos em `src/components/Brand/`: `LogoMark` (SVG inline com prop de colorway) e `Cursor` (barra piscando, tamanho por props). `src/components/UI/ColorPicker` é removido.

## 5. Dados

Sem banco. Arquivos estáticos:

- `public/fonts/`: Geist 400/500/600 e Geist Mono 500/600 em woff2, self-hosted (licença OFL). As Inter saem. Pré-carregar só Geist 400 e 600.
- `public/favicon.svg` (do handoff) + `favicon.ico` regenerado; `apple-touch-icon.png` 180×180 a partir de `app-icon-1024.svg`.
- `public/og-image.png`: exportar `assets/og-image.svg` para PNG 1200×630.
- `localStorage.primaryColor` deixa de ser usado e é apagado.

## 6. Segurança e privacidade

- **Quem pode:** site público, sem autenticação; sem mudança.
- **Entrada não confiável:** nenhuma nova. O script inline só lê `localStorage.theme` e aceita apenas `"light"`/`"dark"`.
- **Abuso:** sem formulário ou endpoint novo.
- **Dados pessoais:** nenhum novo. Fontes self-hosted (sem Google Fonts), então nenhum IP de visitante vai a terceiros. Nenhum cookie.
- **Log:** sem log novo.
- **CSP (spec 0003):** o script inline de tema vai precisar de hash `sha256` no `script-src` quando a CSP entrar. Registrar na 0003.

## 7. UI e i18n

- Telas: home (`/`, `/pt`), mais Header, Footer e tema, compartilhados com o `/portfolio`. O portfólio herda os tokens e a fonte novos, mas o layout dele é da 0006. Enquanto a 0006 não sair, o portfólio só não pode quebrar visualmente.
- Chaves novas em `src/i18n/{en,pt}.ts`: `header.themeLight`/`themeDark`; `company.hero.ctaPrimary`/`ctaSecondary`; `company.sectionIndex` (formato "01 / Products"); `company.services.steps[]`; `company.founder.name`; `footer.copyright(year)`. A chave `company.hero.scroll` sai, porque o handoff não tem o indicador de rolagem.
- Português: "Software studio" → "Estúdio de software"; "Talk about a project" → "Fale sobre um projeto"; "See what we're building" → "Veja o que estamos construindo"; passos: Planejamento, Design, Desenvolvimento, App Store e Google Play. Critérios: Servidor, Elo, Função, Horário, Estilo.
- `meta()`: sem mudança de texto; só a nova `og-image.png`. `theme-color` inicial por `media=(prefers-color-scheme)`, corrigido pelo script inline quando houver escolha manual.

## 8. Critérios de aceite

- [ ] `/` e `/pt` em 1440px e 390px, nos dois temas, conferidos contra `PRMA Code Site.dc.html` nestes pontos: cores de `bg`/`ink`/`muted`/`line`/`card`/`accent` (DevTools), H1 `clamp(64px,13vw,168px)` com letter-spacing −0.055em, H2 44px, container 1160px, padding de seção 96px, raios (card 16, botão 10, chip 8), grid das seções com quebra por auto-fit, e nav recolhida abaixo de 700px.
- [ ] Sem aviso de hydration mismatch no console (fora atributos de extensões), nos dois temas.
- [ ] Com `localStorage.theme = "light"` e o sistema escuro, recarregar não pisca escuro (gravação de tela ou throttling de CPU 6×).
- [ ] O botão de tema alterna, persiste após recarregar e o rótulo muda de idioma com a rota.
- [ ] Com `prefers-reduced-motion: reduce` emulado, nenhum cursor pisca.
- [ ] Nenhuma requisição a `fonts.googleapis.com`/`gstatic.com` (aba Network); Geist 400/600 com preload.
- [ ] O favicon SVG aparece na aba; `/og-image.png` é a nova arte em 1200×630.
- [ ] Contraste AA: texto `muted` sobre `bg` nos dois temas, e `#141413` sobre o laranja.
- [ ] `ColorPicker` removido e `primaryColor` apagado do `localStorage`.
- [ ] Nenhum texto visível fixo em componente (grep nos componentes novos).
- [ ] `yarn typecheck` e `yarn build` passam; o SSR de `/` ainda tem title, canonical, hreflang e JSON-LD (curl).
- [ ] `/portfolio` abre sem erro e sem layout quebrado com os tokens novos.

## 9. Fora do escopo

- Redesign do `/portfolio` (spec 0006) e melhoria do carrossel 3D (spec 0007).
- Mudar textos, SEO ou estrutura de rotas.
- Exportar o wordmark em curvas para uso fora da web, cartão de visita e avatar de rede social (assets do handoff, uso do usuário).
- CSP e headers (spec 0003).

## 10. Perguntas abertas

- Tema por variáveis CSS + script pré-pintura + tokens em JS para Three.js/GSAP → ADR 0003 (`/hefesto:adr`) depois da aprovação.
- `docs/decisoes.md` §6 → atualizado em 23/11/2026 (handoff aprovado, seletor de cor removido por decisão do usuário).
- Fontes e assets: woff2 da release oficial `vercel/geist-font` (OFL), conferindo o checksum. SVG → PNG/ICO com o Chrome headless já usado para a OG, sem dependência nova. Downloads exigem confirmação na execução.
- Rótulo do CNPJ no rodapé em inglês → pendência 5 do `decisoes.md`, com o usuário.
