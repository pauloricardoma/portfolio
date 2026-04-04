# Plano 01 — Foundation + Hero/Apresentação

## Objetivo
Reestruturar o projeto do zero com a arquitetura definida, criar o design system com styled-components e implementar a seção Hero com animações de scroll.

---

## Fase 1: Reestruturação do Projeto

### 1.1 Trocar stack de estilização
- [ ] Remover Tailwind CSS (`tailwindcss`, `@tailwindcss/vite`)
- [ ] Instalar `styled-components` e `@types/styled-components`
- [ ] Instalar `gsap` e `@gsap/react` (animações de scroll, entrada de elementos, timelines)
- [ ] Remover `app.css` com estilos Tailwind
- [ ] Atualizar `vite.config.ts` (remover plugin do Tailwind)

### 1.2 Reestruturar pastas (mover de `/app` para `/src`)
- [ ] Atualizar `react-router.config.ts` com `appDirectory: "src"`
- [ ] Criar estrutura de pastas:
  ```
  src/
  ├── components/
  │   ├── UI/           # Componentes reutilizáveis (Button, Text, etc.)
  │   └── Shell/        # Layout shell (Header, Footer, PageWrapper)
  ├── hooks/            # Custom hooks globais
  ├── interfaces/
  │   └── home/         # Interfaces da page Home
  ├── pages/
  │   └── home/
  │       ├── components/  # Componentes locais da Home
  │       ├── useHome.ts   # ViewModel (hook MVVM)
  │       └── Home.tsx     # View
  ├── routes/
  │   └── home.tsx       # Route entry (meta, loader, exporta a page)
  ├── styles/
  │   ├── themes/
  │   │   ├── light.ts
  │   │   ├── dark.ts
  │   │   └── types.ts   # Interface do tema
  │   ├── tokens.ts      # Spacing, typography, breakpoints
  │   └── global.ts      # GlobalStyle do styled-components
  ├── root.tsx           # Root layout
  └── routes.ts          # Definição das rotas
  ```
- [ ] Mover e adaptar `root.tsx` (remover Tailwind classes, usar styled-components)
- [ ] Atualizar `tsconfig.json` (path alias `~/` → `./src/`)

### 1.3 Configurar styled-components com SSR
- [ ] Criar o ThemeProvider wrapper no root
- [ ] Configurar SSR do styled-components (evitar flash de conteúdo sem estilo)
  - React Router v7 usa streaming SSR, precisa do `ServerStyleSheet`

---

## Fase 2: Design System

### 2.1 Tokens de design
- [ ] Definir paleta de cores (inspirado no Coordly, simplificado):
  - `primary` — azul marinho (ex: `#0A1628` base, com variações hover/pressed/outline)
  - `secondary` — cor complementar neutra
  - `surface` — backgrounds (light: branco/cinza, dark: escuros)
  - `danger` — vermelho para erros
  - `warning` — amarelo para alertas
  - `success` — verde para sucesso
- [ ] Definir escala de tipografia (font sizes, weights, line heights)
- [ ] Definir escala de spacing (4px base grid)
- [ ] Definir breakpoints para responsividade

### 2.2 Temas light e dark
- [ ] Criar interface `ITheme` tipando toda a estrutura
- [ ] Implementar tema light (padrão)
- [ ] Implementar tema dark
- [ ] Criar hook `useTheme` para toggle de tema
- [ ] Persistir preferência no localStorage

### 2.3 Componentes UI base
- [ ] `Text` — componente de tipografia com variantes (h1, h2, body, caption, etc.)
- [ ] `Button` — com variantes (primary, secondary, ghost)
- [ ] `Container` — wrapper de layout com max-width
- [ ] `Section` — wrapper de seção com padding padrão

---

## Fase 3: Hero / Apresentação

### 3.1 Layout do Hero
- [ ] Criar `HeroSection` component dentro de `pages/home/components/`
- [ ] Layout fullscreen (100vh) com nome, título/role, e uma frase de impacto
- [ ] Indicador de scroll (seta ou animação indicando "role para baixo")

### 3.2 Animações de entrada (GSAP)
- [ ] Registrar plugins: `gsap.registerPlugin(ScrollTrigger)`
- [ ] Criar timeline de entrada do Hero com `gsap.timeline()`:
  - Texto do nome: fade + slide up (`fromTo` com opacity e y)
  - Título: aparecendo em sequência (stagger nos filhos da timeline)
  - Subtítulo/frase: fade in com delay
- [ ] Animação suave e elegante, não exagerada
- [ ] Usar `useGSAP` hook do `@gsap/react` (cleanup automático de animações)

### 3.3 Animações de scroll (GSAP ScrollTrigger)
- [ ] Configurar `ScrollTrigger` para cada seção
  - `trigger`: o elemento que ativa a animação
  - `start`/`end`: quando começa e termina (ex: "top 80%" → ativa quando o topo do trigger chega a 80% da viewport)
  - `scrub`: vincula a animação ao progresso do scroll (true = 1:1 com scroll)
  - `pin`: fixa o elemento enquanto a animação roda (útil pro Hero)
- [ ] Elementos saindo com parallax suave ao scrollar (diferentes velocidades de `y`)
- [ ] Textos das seções seguintes entrando com fade + slide conforme scroll
- [ ] Criar hook `useScrollAnimation` reutilizável para padrões comuns de entrada

---

## Dependências a instalar
```
yarn add styled-components gsap @gsap/react
yarn add -D @types/styled-components
```

## Ordem de execução sugerida
1. Fase 1 (reestruturação) → precisa estar pronta antes de tudo
2. Fase 2 (design system) → base para todos os componentes
3. Fase 3 (hero) → primeira seção visual funcional
