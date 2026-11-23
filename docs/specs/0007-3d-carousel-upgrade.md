# Spec 0007 — Carrossel 3D do portfólio mais detalhado e fluido

- **Status:** concluída (aprovada em 23/11/2026)
- **Pedido original:** "queria que a gente melhorasse o que temos, ficasse mais detalhado, mais fluido, pra mostrar expertise com 3D também. bora com uma feature nova pra isso" / "Precisamos do plano de melhorar o carrousel 3d"
- **Data:** 23/11/2026
- **Planos:** 06, 07
- **Depende de:** 0006 (palco, controles, interface `activeIndex`/`onSelect`/cores em hex, fallback sem WebGL). O plano desta spec só começa com o plano 05 concluído.

## 1. Problema

A cena do `/portfolio` usa caixas arredondadas simples, 3 luzes básicas e um giro por lerp. Ela não mostra o nível de 3D que o fundador quer vender. O carrossel deve virar uma peça de demonstração: aparelhos modelados em código, luz de estúdio e movimento fluido, sem pesar na home nem travar o celular.

## 2. Comportamento esperado

Decisões do usuário (23/11/2026): modelagem própria, sem GLTF de terceiros; arraste com inércia, entrada ao rolar, parallax do cursor e pós-processamento.

1. **Aparelhos modelados em código** (geometria procedural, sem arquivo de modelo):
   - Celular: corpo com bordas chanfradas e laterais metálicas, tela inset com cantos arredondados e ilha/notch, módulo de câmera traseiro, botões laterais.
   - Notebook: base com teclado (o `LaptopKeyboard` atual, refinado), trackpad, tampa com moldura e câmera, dobradiça que articula.
   - Tela com a screenshot do projeto, sem ser escurecida pela luz e com um reflexo sutil por cima.
2. **Luz e materiais:** materiais PBR (metal escovado, vidro, alumínio anodizado nas cores do tema); ambiente de estúdio montado em código (`<Environment>` do drei **só com `Lightformer`**, sem `preset` nem `files`, que baixariam HDR de CDN); sombra de contato no "piso" do palco (mancha suave sob cada aparelho; ver ADR 0004). Cores por `themeMode` (claro e escuro), em hex vindo de `tokens.colors`.
3. **Entrada ao rolar:** quando o palco entra na tela pela primeira vez, os aparelhos sobem com escalonamento e a tampa do notebook abre (`ENTRANCE_DURATION`, 1,2s). Acontece uma vez por sessão (`sessionStorage`); trocar de idioma ou voltar à página não repete.
4. **Arraste com inércia:** arrastar gira o carrossel; ao soltar, o giro continua com a velocidade do gesto, desacelera (`INERTIA_FRICTION`) e encaixa no aparelho mais próximo, que vira o ativo. No palco, `touch-action: pan-y`: o gesto só vira giro quando o deslocamento horizontal passa de `DRAG_START_PX` (10px) e o ângulo do gesto fica abaixo de `DRAG_MAX_ANGLE` (30° da horizontal); senão, é rolagem da página e o carrossel ignora. Nada de `preventDefault` em `touchmove`.
5. **Parallax do cursor:** com mouse sobre o palco, a cena inclina até `PARALLAX_MAX_DEG` (4°) seguindo o ponteiro, com amortecimento; o aparelho ativo flutua de leve. Sem efeito em toque.
6. **Pós-processamento:** profundidade de campo leve (foco no aparelho ativo) e bloom sutil só em realces emissivos (LED da câmera, reflexos do metal). A tela com a screenshot fica **fora** do bloom (seleção por camada), para não estourar screenshot clara no tema claro. Ligado só quando `(pointer: fine)` e o `PerformanceMonitor` do drei não detecta queda; desligado no celular. *(Execução, plano 06: a profundidade de campo saiu porque apagava o alpha do canvas e o palco ficava preto; a tela fica fora do bloom por limiar de luminância (tela ≤ 1, `toneMapped=false`), não por camada. Ver ADR 0004.)*
7. **Troca de projeto** (botões, dots, teclado, clique): transição com mola/ease, sem salto. **O último comando vence:** um comando durante a inércia ou durante a mola cancela o movimento em curso e segue para o novo alvo.
8. **Clique × arraste:** um gesto que moveu menos de `CLICK_MAX_PX` (6px) é clique (seleciona o aparelho); acima disso é arraste e não dispara clique no fim.

### Erros e casos de borda

| Situação | O que acontece | `code` devolvido |
| --- | --- | --- |
| `prefers-reduced-motion: reduce` | Sem entrada animada, parallax, flutuação ou inércia; tampa já aberta. O arraste ainda gira, mas ao soltar encaixa na hora; troca por botão é instantânea | — |
| Palco fora da tela ou aba oculta | Render pausado (sem consumo de GPU) e medição de FPS pausada, para a volta da aba não contar como queda | — |
| FPS abaixo de `FPS_MIN` (45) por 2s seguidos | Degrada um nível por vez: pós-processamento → sombra de contato → DPR mínimo 1. Volta um nível depois de 5s acima de `FPS_RECOVER` (58); no máximo 3 trocas por visita, depois fica no nível atual | — |
| Celular / ponteiro grosso | Sem pós-processamento, DPR máx. 1,5, sombra de contato em baixa resolução | — |
| Sem WebGL ou erro na cena | Fallback de screenshot da 0006 | — |
| Arraste começado na vertical | Vira rolagem da página; o carrossel não gira | — |

## 3. Regras de negócio

- Nenhum asset 3D de terceiros. Tudo em código, no repositório.
- Os limites (ângulo do parallax, duração da entrada, FPS mínimo, DPR) ficam num objeto de configuração da cena (`src/components/3D/config.ts`), não espalhados.
- As screenshots continuam as de `public/projects/`.

## 4. Contratos

Sem API. A cena mantém a interface da 0006: `activeIndex` é **controlado** pela página (dona do estado), e a cena avisa mudanças por um callback só, `onSelect(index, source)`, com `source` = `"drag" | "click"`. Durante a inércia a cena anima livremente e chama `onSelect` uma vez, no encaixe; se `activeIndex` mudar por fora no meio do movimento, a cena abandona a inércia e vai para ele. A lógica de ângulo, inércia e encaixe fica em funções puras (`src/components/3D/carouselMath.ts`), separadas do render; os limites ficam em `src/components/3D/config.ts`.

## 5. Dados

Sem banco nem arquivos novos de dados. Nenhum modelo, textura ou HDR baixado.

## 6. Segurança e privacidade

- **Quem pode:** página pública; sem mudança.
- **Entrada não confiável:** só eventos de ponteiro e teclado locais.
- **Abuso:** sem endpoint. O risco é de desempenho, coberto pelos limites e pela degradação da §2.
- **Dados pessoais:** nenhum. Nada de telemetria de FPS enviada para fora.
- **Log:** sem log.
- **Dependência nova:** `@react-three/postprocessing` (e o `postprocessing` que ela usa) passa pela checagem da `seguranca.md` §4 (manutenção, popularidade, scripts de instalação) e pelo `yarn audit` antes de entrar no plano.

## 7. UI e i18n

- Tela: só o palco do `/portfolio` e do `/pt/portfolio`. Nenhum texto novo, porque os rótulos de acessibilidade já vêm da 0006.
- A cena continua em chunk lazy, só no portfólio.

## 8. Critérios de aceite

- [ ] Celular e notebook têm os detalhes da §2.1 visíveis no aparelho ativo, nos dois temas: checklist item a item (chanfro, câmera, botões, ilha, dobradiça, trackpad) com captura de tela anexada ao plano.
- [ ] A entrada ao rolar acontece uma vez por sessão, com a tampa abrindo em `ENTRANCE_DURATION`; trocar para `/pt/portfolio` não repete; recarregar a aba (nova sessão só ao fechar) não repete.
- [ ] Aba Network sem requisições de HDR, textura ou modelo durante o uso do carrossel.
- [ ] Um gesto de menos de `CLICK_MAX_PX` seleciona o aparelho; um arraste não dispara clique no fim; um comando durante a inércia leva ao novo alvo.
- [ ] Um arraste rápido gira com inércia e encaixa num aparelho; o contador e os detalhes mostram o projeto encaixado.
- [ ] No celular (DevTools com toque e num aparelho real), o swipe vertical rola a página e o horizontal gira.
- [ ] Parallax de no máximo `PARALLAX_MAX_DEG`, só com mouse.
- [ ] Pós-processamento ligado no desktop e desligado no perfil mobile do DevTools.
- [ ] Com reduced motion, nada se move sozinho e a troca é instantânea.
- [ ] Desktop: ≥ 55 FPS médios durante o arraste (Performance do DevTools). Mobile emulado com CPU 4×: ≥ 30 FPS.
- [ ] Com o palco fora da tela, o Performance mostra o loop de render parado.
- [ ] O chunk lazy da cena com a lib nova fica abaixo de 330 KB gzip (base em 23/11/2026: 235 KB), e a home não carrega nada dele (`yarn build`).
- [ ] As funções de `carouselMath.ts` (ângulo → índice, encaixe, inércia, caminho mais curto) são puras e têm testes Vitest com casos de borda (índice negativo, loop, velocidade zero); `yarn test` passa.
- [ ] `yarn typecheck` e `yarn build` passam.

## 9. Fora do escopo

- Modelos GLTF, HDR ou texturas de terceiros.
- Novos projetos ou screenshots.
- 3D na home.
- Telemetria de desempenho.

## 10. Perguntas abertas

- ~~Test runner~~ → **decidido (usuário, 23/11/2026): Vitest** como devDependency, com script `yarn test`, para testar `carouselMath.ts`.
- ~~Three.js × CSS 3D~~ → ADR 0004 (23/11/2026).
- ~~Versão do postprocessing~~ → `@react-three/postprocessing@^3.2.2` + `postprocessing@^6.39`, com `@react-three/fiber` em `^9.8` (plano 06).
