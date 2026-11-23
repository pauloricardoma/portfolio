# ADR 0004 — Carrossel do portfólio em Three.js, com orçamento de bundle e degradação

- **Status:** aceito
- **Data:** 23/11/2026
- **Vale para:** a cena 3D do `/portfolio` (`src/components/3D/`, `ProjectsSection`).
- **Spec / plano:** specs 0006 e 0007, planos 05 e 06 (o 07 cuida do movimento).

## Contexto

O handoff da nova identidade propõe um carrossel em CSS 3D (transforms com perspectiva), leve e sem WebGL. O usuário decidiu manter e melhorar o carrossel em Three.js: o portfólio também vende a expertise em 3D do fundador. O custo é peso de JS, GPU no celular e a chance de o WebGL não existir ou falhar.

## Decisão

1. **Three.js (React Three Fiber + drei)** no palco do portfólio, com a seção renderizada no SSR e só a cena em chunk `lazy()`, montada depois de detectar WebGL. Erro na cena cai num `WebGLBoundary` que mostra a screenshot (spec 0006).
2. **Nada de asset 3D de terceiros:** aparelhos modelados em código (`geometry.ts`, `DevicePhone`, `DeviceLaptop`) e luz de estúdio com `<Environment>` só de `Lightformer` (sem `preset`/`files`, que baixam HDR de CDN). A cena não faz requisição além das screenshots de `public/projects/`.
3. **Orçamento:** chunk da cena abaixo de 330 KB gzip, conferido no `yarn build` a cada mudança. O pós-processamento (`@react-three/postprocessing`) fica num chunk lazy à parte, que só baixa com ponteiro fino (desktop). Em 23/11/2026: cena 264 KB + efeitos 39 KB.
4. **Degradação por FPS:** o `PerformanceMonitor` do drei mede o FPS (só com a aba visível) e o `useSceneQuality` desce um nível por vez: sem pós → sem sombra → DPR 1; no máximo 3 trocas por visita. Celular começa sem pós. Limites em `src/components/3D/config.ts`.
5. **Sombra de contato por mancha** (plano com gradiente radial sob cada aparelho), não o `ContactShadows` do drei.

## Alternativas consideradas

- **CSS 3D do handoff:** quase sem custo, mas sem materiais, luz nem modelagem; não mostra 3D de verdade. Descartado pelo usuário.
- **Modelos GLTF prontos:** mais realistas, mas são asset de terceiros (licença, peso de download, requisição extra). Descartado na spec 0007.
- **`ContactShadows` do drei:** sombra mais fiel, mas renderiza a cena de novo a cada frame e, com o `EffectComposer`, virava um plano cinza opaco no palco transparente.
- **Profundidade de campo (`DepthOfField`):** prevista na spec 0007, mas apaga o alpha do canvas e o palco ficava preto. Ficou só o bloom (com MSAA). Voltar a ela exige pintar o fundo do palco dentro da cena.

## Consequências

- O portfólio pesa ~300 KB a mais que a home, só depois do hero e só com WebGL; a home não carrega nada disso.
- Mudança na cena precisa conferir o orçamento no build e a cena nos dois temas (cores em hex por tema, `DEVICE_PALETTE`).
- Quando a CSP entrar (spec 0003), ela não pode bloquear os chunks lazy nem as texturas; se bloquear, o `WebGLBoundary` cai na screenshot sem avisar.
