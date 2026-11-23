# Spec 0003 — Headers de segurança, cache de assets e `yarn start`

- **Status:** concluída (aprovada em 23/11/2026; conferência em produção pendente com o usuário)
- **Pedido original:** "pode commitar e seguir pra 0003" (backlog: "`netlify.toml`: headers de segurança (CSP, HSTS, X-Frame-Options), cache de assets e `yarn start` funcionando")
- **Data:** 23/11/2026
- **Planos:** 08

## 1. Problema

O site não envia CSP, `X-Frame-Options`, `Referrer-Policy` nem `Permissions-Policy`. Em produção (curl em 23/11/2026) só saem `strict-transport-security: max-age=31536000` e `x-content-type-options: nosniff`, que a Netlify põe por padrão, e `cache-control: no-cache` no HTML (padrão da Netlify, não definido no código). Os assets com hash não têm cache longo explícito. O `yarn start` aponta para `build/server/index.js`, que não existe.

## 2. Comportamento esperado

### 2.1 Headers do HTML: no SSR, com nonce

O HTML do React Router tem scripts inline que mudam a cada página e requisição (`window.__reactRouterContext` e o stream de dados), então hash não serve. O HTML sai de uma Netlify Function, e os `[[headers]]` do `netlify.toml` podem não valer para respostas de function. Por isso **todos os headers de segurança do HTML são definidos no `src/entry.server.tsx`**, antes do render (valem também para as respostas de erro):

1. Gera um nonce por requisição.
2. Passa o nonce em três lugares:
   - `<ServerRouter nonce>`, para os scripts de dados em stream;
   - `renderToPipeableStream({ nonce })`, para os scripts do React;
   - `<Scripts nonce>` e `<ScrollRestoration nonce>` no `root.tsx`, junto com o script de tema, via `src/contexts/NonceContext.ts`. O valor padrão do contexto é `""`, e o cliente não tem provider.
3. Define os headers:
   - **`Content-Security-Policy`** (só em produção; o dev do Vite usa scripts inline e WebSocket de HMR):
     ```
     default-src 'self';
     script-src 'self' 'nonce-{N}';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data:;
     font-src 'self';
     connect-src 'self';
     object-src 'none';
     base-uri 'self';
     form-action 'self';
     frame-ancestors 'none';
     upgrade-insecure-requests
     ```
   - `X-Frame-Options: DENY` (redundante com `frame-ancestors`, para navegadores antigos);
   - `Referrer-Policy: strict-origin-when-cross-origin`;
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`;
   - `Cross-Origin-Opener-Policy: same-origin`;
   - `X-Content-Type-Options: nosniff`;
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`, sem `preload`, que é difícil de desfazer;
   - `Cache-Control: no-store`. Com nonce, um HTML cacheado (Netlify ou Cloudflare) reaproveitaria o nonce e anularia a CSP.

A política e os headers ficam em `src/config/security.ts`: `buildCsp(nonce)` e `securityHeaders`, como funções e constantes puras.

Duas notas sobre a política:
- **`style-src 'unsafe-inline'`:** o styled-components injeta `<style>` no SSR e no cliente, e há atributos `style` do React. Pôr nonce nos estilos do styled-components é frágil. Num site sem entrada de usuário, o risco de injeção de estilo é baixo (risco aceito, §6).
- **Script de tema:** com nonce, ele **não precisa mais de hash**. O ADR novo substitui a consequência de hash do ADR 0003 e da spec 0005 §6 (§10).

### 2.2 Headers estáticos e cache: `netlify.toml`

Só para os arquivos estáticos (o CDN da Netlify serve sem function):

- `/assets/*` (nome com hash do Vite): `Cache-Control: public, max-age=31536000, immutable`;
- `/fonts/*` (nome sem hash): `public, max-age=2592000` (30 dias);
- `/projects/*`, `/og-image.png`, `/favicon.*`, `/apple-touch-icon.png`: `public, max-age=86400`;
- `/*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, e o mesmo HSTS do §2.1, para os estáticos também levarem.

O toml não define o build command nem o publish dir, que continuam os da Netlify e do plugin. Um comentário no toml aponta para esta spec.

### 2.3 `yarn start`

Passa a `react-router-serve ./build/server/server-build.js` (testado em 23/11/2026: `/portfolio` 200, assets 200). Com `NODE_ENV=production`, serve o build com a CSP para conferir localmente.

Ele não lê o `netlify.toml`, então localmente só dá para testar os headers do SSR. O caminho vem do plugin da Netlify e pode mudar numa atualização: anotar no `CLAUDE.md`.

### Erros e casos de borda

| Situação | O que acontece | `code` devolvido |
| --- | --- | --- |
| Script inline sem nonce (ex.: alguém adiciona um `<script>` no `root.tsx`) | Bloqueado pela CSP, com violação no console; o critério de aceite pega | — |
| Chunk lazy do 3D ou textura bloqueada | Não deve acontecer (`'self'`). Se acontecer, o `WebGLBoundary` mostra a screenshot sem avisar; o critério exige `<canvas>` ativo | — |
| Página 404 renderizada pelo `ErrorBoundary` | Mesmo HTML, com nonce e os headers | — |
| Falha do shell (`onShellError`) ou abort de 5s | Os headers já foram definidos antes do render e valem para a resposta que sair; sem HTML parcial com script fora da CSP | — |
| Navegador sem suporte a nonce | Ignora a CSP de script (comportamento padrão) e o site funciona | — |
| Extensão do visitante injetando script | Pode ser bloqueada e gerar aviso no console dele, sem efeito no site | — |

## 3. Regras de negócio

- Nenhum domínio de terceiro na CSP: o site não carrega nada de fora. Fontes, 3D e imagens são do próprio site (ADR 0004).
- Nonce: 128 bits de `crypto.getRandomValues` (global no Node 22), em base64, novo a cada requisição. Nunca reaproveitado nem logado.
- Mudança que precise de origem nova (analytics, embed) exige spec e atualização da CSP.
- Dependência 3D nova precisa conferir se usa worker ou `blob:` (`worker-src`).

## 4. Contratos

Sem API. Pontos de contato:

- `src/config/security.ts` (novo): `buildCsp(nonce)`, `securityHeaders` e `createNonce()`.
- `src/contexts/NonceContext.ts` (novo): contexto com valor padrão `""`.
- `src/entry.server.tsx`: gera o nonce, define os headers antes do render e passa o nonce ao `ServerRouter`, ao `renderToPipeableStream` e ao provider do contexto.
- `src/root.tsx`: `useContext(NonceContext)` para `<Scripts>`, `<ScrollRestoration>` e o script de tema.
- `netlify.toml` (novo): cache e headers dos estáticos.
- `package.json`: script `start`.

## 5. Dados

Sem dados.

## 6. Segurança e privacidade

- **Quem pode:** site público; sem mudança.
- **Entrada não confiável:** nenhuma nova. A CSP reduz o impacto de um XSS futuro: só rodam scripts com nonce ou do próprio site.
- **Abuso:** clickjacking bloqueado por `frame-ancestors 'none'` e `X-Frame-Options`.
- **Dados pessoais:** nenhum. `Referrer-Policy` evita mandar a URL completa a terceiros nos links externos.
- **Log:** o nonce nunca vai para log; o `onError` loga só o erro.
- **Cache:** `no-store` no HTML para o nonce não ser reaproveitado pela CDN.
- **Risco aceito:** `style-src 'unsafe-inline'` (motivo no §2.1), registrado em `docs/seguranca.md` §5.
- **HSTS `includeSubDomains`:** vale para todo subdomínio de `prmacode.dev`, presente e futuro (§10).
- **`docs/seguranca.md`:**
  - §5: a linha "Sem headers de segurança" passa a "CSP com nonce no SSR (`entry.server`) e cache/estáticos no `netlify.toml`", resolvida;
  - §6: ganha a conferência dos headers e do Cloudflare em produção.

## 7. UI e i18n

Sem mudança visual nem texto novo.

## 8. Critérios de aceite

- [ ] `yarn test`:
  - `buildCsp(nonce)` gera a política do §2.1 com o nonce;
  - um teste do `handleRequest` (ou de uma função extraída dele) confere o header CSP presente, nonce diferente a cada chamada e igual ao dos `<script>` executáveis do HTML.
- [ ] `yarn build && NODE_ENV=production yarn start`, com `curl -I` em `/`, `/pt`, `/portfolio`, `/pt/portfolio` e numa rota 404:
  - os headers do §2.1 aparecem;
  - `Cache-Control: no-store`;
  - o nonce muda a cada requisição.
- [ ] Todo `<script>` executável inline do HTML dessas rotas leva o nonce do header (grep no HTML do curl). O JSON-LD (`application/ld+json`) não precisa.
- [ ] No Chrome com o `yarn start`, home e portfólio, nos dois temas e idiomas:
  - sem violação de CSP no console;
  - tema sem piscar;
  - no `/portfolio`, um `<canvas>` WebGL ativo (sem o fallback de screenshot), com efeitos, entrada e troca de idioma funcionando.
- [ ] No `yarn dev`: HMR funcionando, sem CSP, e sem hydration mismatch com o nonce gerado (é onde o React avisa diferença de atributo).
- [ ] Depois do deploy:
  - `curl -I https://prmacode.dev/` mostra os headers do §2.1 com um HSTS só;
  - `curl -I` num arquivo de `/assets/` mostra `immutable`;
  - `/fonts/geist-400.woff2` mostra `max-age=2592000`.
- [ ] Checklist do Cloudflare (passo do usuário): nenhuma regra "Cache Everything" no HTML; Rocket Loader, Zaraz, Web Analytics e Email Obfuscation desligados (injetam script ou reescrevem o HTML); HSTS não duplicado no Cloudflare.
- [ ] securityheaders.com para `prmacode.dev` com nota A ou melhor (passo do usuário).
- [ ] O ADR novo (nonce) está registrado. Notas de hash removidas do `docs/specs/README.md` e do `themeScript.ts`; o ADR 0003 não é editado.
- [ ] `yarn typecheck`, `yarn test` e `yarn build` passam.

## 9. Fora do escopo

- `preload` do HSTS e envio à lista de preload.
- Reporting de CSP (`report-uri`/`report-to`): exigiria endpoint ou serviço de terceiro.
- Nonce nos estilos (`style-src` sem `unsafe-inline`).
- Cache de HTML na CDN.
- Atualizar dependências com vulnerabilidade (pendência própria).

## 10. Perguntas abertas

- CSP com nonce por requisição no `entry.server` (em vez de `netlify.toml` estático e hash), com o SSR dono dos headers do HTML e o toml dono dos estáticos → **ADR 0005** depois da aprovação. Ele substitui a consequência de hash do ADR 0003 e da spec 0005 §6.
- ~~Subdomínio só em HTTP?~~ → não existe subdomínio (usuário, 23/11/2026); `includeSubDomains` mantido.
- Os `[[headers]]` do toml valem para respostas de function na Netlify? → conferir no deploy; a spec já não depende disso para o HTML.
