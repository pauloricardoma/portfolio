# Spec 0006 — Identidade visual: redesign do /portfolio

- **Status:** concluída
- **Pedido original:** "Beleza, começa no docs/design_handoff_prma_code_brand_site/README.md" + "queria que a gente melhorasse o que temos [no carrossel], mais detalhado, mais fluido, pra mostrar expertise com 3D também. bora com uma feature nova pra isso"
- **Data:** 23/11/2026
- **Planos:** 05
- **Depende de:** 0005 (tokens, fontes, header, footer, `LogoMark`, `Cursor`)

## 1. Problema

O `/portfolio` ainda tem o layout antigo. O handoff (`design_files/PRMA Code Portfolio.dc.html`) traz o novo layout com a identidade da marca. O handoff propõe um carrossel em CSS 3D; o usuário decidiu **manter o Three.js**. Esta spec aplica o layout em volta do carrossel, e a cena 3D em si fica para a spec 0007.

## 2. Comportamento esperado

1. **Header:** o mesmo da 0005, com a nav Projects, Skills, Contact e "PRMA Code ↗" (link interno para `/` ou `/pt`, sem `target="_blank"`; o ↗ é só visual).
2. **Hero:** eyebrow "Paulo Ricardo Almeida · Founder, PRMA Code", H1 "Software Engineer" (`clamp(56px,10vw,136px)`) com cursor, lead (texto atual), botões "See projects ↓" (âncora) e "Get in touch" (âncora para o contato).
3. **01 / Projects:**
   - Palco: altura `clamp(420px,48vw,580px)`, raio 20, fundo `card`, borda de 1px, gradiente de piso nos 38% de baixo. A cena Three.js atual fica dentro dele, com fundo transparente e luz ajustada aos dois temas.
   - Controles: contador "01 / 03" (mono), botões redondos de 44px ← → com loop, setas do teclado ← → quando o palco tem foco, e dots em pill (ativo: 28px e laranja; inativo: 6px e muted). Clicar num aparelho lateral o torna ativo (como hoje).
   - Linha de detalhes do projeto ativo: índice · plataforma, nome, tipo, cards de métrica (valor 28px/600 + rótulo), descrição e chips de stack.
4. **02 / Skills · Stack:** 6 grupos numa grade com divisórias de 1px (`minmax(min(100%,300px),1fr)`), cada um com título, índice mono e chips. Saem os emojis e a barra de proficiência.
5. **03 / Contact** (faixa escura): "Let's talk" + cursor, texto, botões Email (laranja, mailto do e-mail pessoal atual), GitHub ↗ e LinkedIn ↗ (contorno, `target="_blank"` com `rel="noopener noreferrer"`).
6. **Footer:** marca + "Paulo Ricardo Almeida © {ano}" · "A PRMA Code profile".

### Erros e casos de borda

| Situação | O que acontece | `code` devolvido |
| --- | --- | --- |
| WebGL indisponível ou Three.js falha | Antes de montar o `<Canvas>`, testa-se `canvas.getContext("webgl2"\|"webgl")`; sem contexto, ou se um ErrorBoundary em volta do `<Canvas>` pegar erro, o palco mostra a screenshot do projeto ativo num quadro simples. Controles e detalhes continuam funcionando | — |
| Projeto sem métricas | A linha de métricas não aparece (nada inventado) | — |
| Seta do teclado com foco fora do palco | Não troca de projeto (não sequestra a rolagem da página) | — |
| `prefers-reduced-motion` | A troca de projeto é instantânea; cursores ficam estáticos | — |

## 3. Regras de negócio

- Conteúdo dos projetos = conteúdo atual (Coordly, La Fabrique Flottante, Codemobile), com as mesmas descrições e stacks. Os placeholders do handoff para os apps mobile são preenchidos com esses dados.
- Métricas: só a Coordly tem ("400k+ items rendered", "~50% less memory usage"), tiradas da descrição atual. Os outros dois ficam sem métricas.
- O "tipo" de cada projeto sai do texto atual: Coordly "SaaS management platform"; La Fabrique "International mobile app"; Codemobile "Full-stack and mobile projects". As traduções PT seguem as descrições atuais.
- Skills: os mesmos itens de hoje; "Virtualização" passa a "Virtualization" no inglês.
- O rodapé do contato "Built with React, Three.js & GSAP" sai (o handoff não tem).

## 4. Contratos

Sem API. Tipos consolidados em `src/interfaces/portfolio/`:

- `IProjectData` (cru, localizado, usado no `usePortfolio`) e `IProject` (resolvido para a View). Ganham `kind` e `metrics?: { value; label }[]`, ambos `Localized` (o PT escreve "+400k", o EN "400k+").
- `ISkillCategory` sai de `SkillCategory.tsx` para `interfaces/portfolio`, sem `icon` e `proficiency`. O tipo de link de contato local de `ContactSection.tsx` também sobe para lá.
- A cena 3D recebe `activeIndex`, `onSelect` e as cores em hex do modo atual (`tokens.colors[themeMode]`, da 0005), nunca `var(--…)`. Essa é a interface que a 0007 vai usar.

## 5. Dados

Sem banco. Dados em `src/pages/portfolio/usePortfolio.ts` (como hoje). As screenshots de `public/projects/` continuam as mesmas.

## 6. Segurança e privacidade

- **Quem pode:** página pública; sem mudança.
- **Entrada não confiável:** nenhuma.
- **Abuso:** sem endpoint ou formulário.
- **Dados pessoais:** os mesmos de hoje e públicos de propósito (e-mail pessoal, GitHub, LinkedIn, conforme `decisoes.md`). Nenhum dado novo.
- **Log:** sem log.
- Links externos com `rel="noopener noreferrer"` (regra permanente §4).

## 7. UI e i18n

- Telas: `/portfolio` e `/pt/portfolio`.
- Acessibilidade do carrossel: palco com `role="region"`, `aria-roledescription="carousel"`, `aria-label` traduzido e `tabIndex=0` (as setas do teclado valem com foco nele); contador com `aria-live="polite"`; botões ← → e dots com `aria-label` traduzido; dot ativo com `aria-current="true"`.
- Chaves novas: `portfolio.hero.eyebrow`, `ctaProjects`, `ctaContact`; `portfolio.projects.counter(i, n)`, `metricsLabel`, `carouselLabel`, `goTo(name)`; `portfolio.footer.profileOf`; `header.companySite`. `previous`/`next`/`view(name)` já existem. Sai `portfolio.contact.madeWith`. Os índices de seção usam o mesmo formato da 0005.
- `meta()` e JSON-LD `Person`: sem mudança.

## 8. Critérios de aceite

- [ ] `/portfolio` e `/pt/portfolio` em 1440px e 390px, nos dois temas, conferidos contra `PRMA Code Portfolio.dc.html` fora do palco 3D: H1 `clamp(56px,10vw,136px)`, palco `clamp(420px,48vw,580px)` com raio 20, botões de 44px, dot ativo de 28px laranja, métrica 28px/600, grade de skills com `minmax(min(100%,300px),1fr)`.
- [ ] Leitor de tela (VoiceOver) anuncia a troca de projeto pelo contador e os rótulos dos controles nos dois idiomas.
- [ ] Botões ← →, dots, clique no aparelho lateral e teclas ← → (com foco no palco) trocam o projeto, com loop, e o contador e os detalhes acompanham.
- [ ] Com WebGL desligado (`chrome://flags` ou `--disable-webgl`), o palco mostra a screenshot e a navegação funciona.
- [ ] A Coordly mostra 2 métricas; os outros projetos não mostram linha de métricas.
- [ ] Os textos dos projetos e skills são os mesmos de antes (diff de `usePortfolio.ts` só estrutural, mais "Virtualization").
- [ ] O Three.js continua lazy e só no `/portfolio` (o chunk não aparece na home no build).
- [ ] Links externos com `rel="noopener noreferrer"`; nenhum texto fixo em componente.
- [ ] `yarn typecheck` e `yarn build` passam; o SSR do `/portfolio` mantém meta e JSON-LD.

## 9. Fora do escopo

- Mudanças na cena 3D (modelos, materiais, câmera, animações): spec 0007. Aqui só fundo, luz e encaixe no palco.
- Novos projetos ou screenshots novas.
- O carrossel em CSS 3D do handoff (descartado pelo usuário).

## 10. Perguntas abertas

- Manter o carrossel em Three.js em vez do CSS 3D do handoff (bundle e fallback × mostrar expertise em 3D) → candidato a ADR junto com a 0007.
