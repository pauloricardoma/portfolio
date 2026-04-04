# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio pessoal — React Router v7 (SSR), React 19, styled-components, GSAP, Three.js (React Three Fiber), TypeScript.

## Commands

- `yarn dev` — Dev server
- `yarn build` — Production build
- `yarn start` — Serve production build
- `yarn typecheck` — Typegen + TypeScript checking

## Architecture

- **React Router v7 framework mode** com SSR (`react-router.config.ts`, `appDirectory: "src"`)
- Rotas manuais em `src/routes.ts` (não file-based)
- Route types auto-gerados em `.react-router/types/`
- Path alias: `~/` → `./src/`
- Package manager: Yarn

### Estrutura de pastas (MVVM)
- `src/components/UI/` — Componentes reutilizáveis (Text, Button, Container, Section)
- `src/components/3D/` — Componentes 3D (Scene, DevicePhone, DeviceLaptop)
- `src/components/Shell/` — Layout (Header)
- `src/hooks/` — Custom hooks globais
- `src/interfaces/` — Interfaces TS separadas por feature
- `src/pages/<page>/` — Cada page segue MVVM: `Home.tsx` (View), `useHome.ts` (ViewModel), `components/` (locais)
- `src/routes/` — Route entries (meta, loader, exportam page)
- `src/styles/` — Design system (themes/, tokens.ts, global.ts)
- `src/contexts/` — Context providers (ThemeContext)
- `src/@types/` — Module augmentation (styled-components DefaultTheme)

### Regras
- Um componente por arquivo, sempre
- styled-components para estilização (NÃO Tailwind)
- Transient props com `$` prefix em styled-components
- Componente: `ComponentName.tsx` + `styles.ts` na mesma pasta
- GSAP + ScrollTrigger para animações (hook `useGSAP` do `@gsap/react`)

### Design System
- Temas light/dark em `src/styles/themes/` com interface `ITheme`
- ThemeProvider via `AppThemeProvider` em `src/contexts/ThemeContext.tsx`
- Tokens constantes (spacing, fontSize, breakpoints) em `src/styles/tokens.ts`
- `color-mix()` CSS para gerar variantes hover/pressed
- Font: Inter (Google Fonts, carregada em `src/root.tsx`)

### 3D (React Three Fiber)
- Scene wrapper em `src/components/3D/Scene.tsx` (Canvas + iluminação)
- Dispositivos 3D: DevicePhone e DeviceLaptop com texturas de screenshot
- Carrossel orbital em `src/pages/home/components/ProjectsSection/ProjectsCarousel.tsx`
- Screenshots placeholder em `public/projects/` (substituir por prints reais)
- Three.js carrega via `lazy()` (code splitting — não bloqueia First Paint)

### SSR
- `styled-components` em `vite.config.ts` → `ssr.noExternal` (obrigatório para SSR funcionar)

### Seções da Home
1. **Hero** — fullscreen, GSAP timeline de entrada + parallax scroll
2. **Projetos** — carrossel orbital 3D (2 phones + 1 laptop), drag/click/setas
3. **Skills** — grid de categorias com stagger animation + barras de proficiência
4. **Contato** — links (email, github, linkedin) + footer
