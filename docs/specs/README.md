# Specs

Toda mudança relevante (feature, regra nova, bug que muda comportamento) entra aqui como spec antes de virar plano. Use `/hefesto:spec <pedido>`.

Status: `ideia` (só o título, no backlog) → `rascunho` → `aprovada` → `planejada` → `concluída` (ou `descartada`).

| #    | Spec | Status | Planos |
| ---- | ---- | ------ | ------ |
| 0001 | LCP do hero: entrada em CSS, sem depender do JS para mostrar o texto (empresa e portfólio). Os dois heroes já entram em CSS (planos 04 e 05); falta medir o LCP no PageSpeed | ideia | — |
| 0002 | Revisão no celular: header (idioma, cor, tema, menu) e seções em telas pequenas | ideia | — |
| 0003 | `netlify.toml`: headers de segurança (CSP, HSTS, X-Frame-Options), cache de assets e `yarn start` funcionando. A CSP precisa liberar o script inline de tema (`src/styles/themeScript.ts`) por hash: hoje `sha256-JTMuLizYteBdxBy+dDOvTfc7rTpKhRj1XK6/e3d+XME=`, recalcular a cada mudança no script. No `/portfolio`, conferir que a CSP não bloqueia os chunks lazy do Three.js nem as texturas (`img-src 'self'`, e `blob:` se o loader usar); se bloquear, o `WebGLBoundary` cai na screenshot sem avisar | ideia | — |
| 0004 | Página de produto (`/products/<app>`) quando o app de jogos for lançado, com link para a landing própria | ideia (depois) | — |
| 0005 | [Identidade visual: base da marca e home](0005-brand-identity-home.md) | concluída | 04 |
| 0006 | [Identidade visual: redesign do /portfolio](0006-portfolio-redesign.md) (depende da 0005) | concluída | 05 |
| 0007 | [Carrossel 3D mais detalhado e fluido](0007-3d-carousel-upgrade.md) (depende da 0006) | concluída | 06, 07 |
