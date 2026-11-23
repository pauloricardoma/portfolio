# ADR 0005 — CSP com nonce por requisição no SSR; `netlify.toml` só para estáticos

- **Status:** aceito
- **Data:** 23/11/2026
- **Vale para:** headers de todo o site (HTML e arquivos estáticos).
- **Spec / plano:** spec 0003, plano 08. Substitui a consequência de hash do ADR 0003 e da spec 0005 §6.

## Contexto

O site precisava de CSP e dos headers de segurança. O plano original (ADR 0003, spec 0005) era uma CSP estática no `netlify.toml`, liberando o script de tema por hash `sha256`.

Isso não serve. O HTML do React Router traz outros scripts inline que mudam a cada página e requisição: `window.__reactRouterContext` e os dados em stream. Para liberá-los por hash, ou se recalcula a cada resposta, ou se cai em `'unsafe-inline'`, que anula a CSP para scripts.

Além disso, o HTML sai de uma Netlify Function, e os `[[headers]]` do `netlify.toml` podem não valer para respostas de function.

## Decisão

1. **O SSR é dono dos headers do HTML.** O `src/entry.server.tsx` gera um nonce por requisição (128 bits, `crypto.getRandomValues`) e define todos os headers **antes** do render, para valerem também em erro e timeout:
   - CSP;
   - `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP e `nosniff`;
   - HSTS com `includeSubDomains`, sem `preload`;
   - `Cache-Control: no-store`.

   A política e os headers ficam em `src/config/security.ts`, testados com Vitest.
2. **O nonce vai a três lugares:** `<ServerRouter nonce>`, `renderToPipeableStream({ nonce })` e, pelo `NonceContext`, `<Scripts>`, `<ScrollRestoration>` e o script de tema no `root.tsx`. No cliente o contexto vale `""`: o navegador esconde o atributo, e o script de tema tem `suppressHydrationWarning`.
3. **CSP só em produção.** O dev do Vite usa scripts inline e WebSocket de HMR. O nonce é gerado em dev também, para a hidratação ser testada lá.
4. **`script-src 'self' 'nonce-…'`, sem terceiros.** `style-src` com `'unsafe-inline'` por causa do styled-components; é risco aceito, em `seguranca.md` §5.
5. **O `netlify.toml` cuida só dos estáticos:** cache longo (`immutable` em `/assets/*`, que têm hash no nome; 30 dias nas fontes; 1 dia nas imagens) e os headers básicos para o que o CDN serve direto.
6. **`no-store` no HTML é obrigatório**, porque um HTML cacheado reaproveitaria o nonce. Regra no Cloudflare: nada de "Cache Everything" no HTML, nem recurso que injete script (Rocket Loader, Zaraz, Web Analytics, Email Obfuscation).

## Alternativas consideradas

- **CSP estática no `netlify.toml` com hashes:** não cobre os scripts dinâmicos do React Router.
- **`script-src 'unsafe-inline'`:** simples, mas a CSP deixa de proteger contra XSS em scripts.
- **Nonce nos estilos do styled-components:** possível, mas frágil (precisa de `StyleSheetManager` e cuidado na hidratação), e o ganho é pequeno num site sem entrada de usuário.
- **Edge function da Netlify para injetar a CSP:** mais uma peça, com o mesmo resultado que o SSR já dá.

## Consequências

- **Script inline novo** precisa do nonce (`useContext(NonceContext)`), senão a CSP bloqueia em produção. Origem nova (analytics, embed) exige spec e mudança em `security.ts`.
- **O HTML não pode ir para cache de CDN.** Hoje já não ia: é SSR por requisição.
- **`yarn start`** (`react-router-serve ./build/server/server-build.js`, com `NODE_ENV=production`) testa os headers do SSR localmente; os do toml só no deploy. O caminho vem do plugin da Netlify e pode mudar ao atualizá-lo.
- **O hash do script de tema deixa de existir:** mudar o script não exige recalcular nada.
