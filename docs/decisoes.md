# PRMA Code (site) — Decisões de Produto e Arquitetura

> Documento vivo com o que já foi decidido, o que é proposta técnica e o que segue em aberto. **É a fonte da verdade.**
> Status: em produção (`prmacode.dev`). Equipe técnica: 1.
> Última atualização: 22/11/2026.

Cada decisão registra **quando** foi tomada (`decidido em DD/MM/AAAA`) quando muda algo anterior. Uma decisão substituída é riscada (`~~antiga~~ → nova`), não apagada.

---

## 1. O produto

Site da PRMA Code, um estúdio de software que cria os próprios produtos e desenvolve apps mobile e web para clientes. Inclui o portfólio do fundador em `/portfolio`. Detalhes em [`produto.md`](produto.md).

---

## 2. Decisões de negócio

| Tema | Decisão |
| --- | --- |
| Papel do site | Site da empresa, com o portfólio pessoal como página interna (decidido em 22/11/2026, antes era só portfólio) |
| Público principal | Avaliadores de programas de crédito (inglês) e potenciais clientes |
| Conteúdo | Curto e verdadeiro. Nada de números, clientes, depoimentos ou parceiros inventados |
| Posicionamento | Estúdio de software, sem citar nacionalidade no texto (decidido em 22/11/2026) |
| Serviços | Aceita projetos de clientes, além dos produtos próprios (decidido em 22/11/2026) |
| Produtos | Lista em `src/config/products.ts`. Hoje: app de jogos (NEXGG, nome público a definir), "em breve", iOS · Android |
| Contato | contato@prmacode.dev (recebendo, confirmado em 22/11/2026). Sem formulário |
| Dados da empresa | PRMA Code, CNPJ 45.056.853/0001-83, no rodapé e no JSON-LD |
| Monetização | Nenhuma |
| Blog | Não, sem rotina de escrita (decidido em 22/11/2026) |

---

## 3. Regras do domínio

### 3.1 Idiomas e rotas

- Inglês na raiz (`/`, `/portfolio`), português em `/pt` (`/pt`, `/pt/portfolio`).
- Sem redirecionamento automático pelo idioma do navegador: atrapalha o Google e quem avalia. Só o botão EN | PT e o `hreflang`.
- `x-default` aponta para o inglês.

### 3.2 SEO

- Toda página tem title e description no idioma, canonical, `hreflang` dos dois idiomas, Open Graph e Twitter card (`src/seo/buildMeta.ts`).
- JSON-LD: `Organization` na página da empresa, `Person` no portfólio. Só dados reais.
- `public/sitemap.xml` lista todas as URLs nos dois idiomas, com alternates. Rota nova entra nele.
- Conteúdo principal precisa ficar visível rápido (LCP). Não depender do JS para mostrar o texto do hero (spec 0001).

### 3.3 Produtos

- Cada produto tem nome e descrição por idioma, plataformas e status (`coming-soon` ou `live`).
- O nome provisório do app de jogos fica na constante `GAMING_APP_NAME` até o nome público sair.

---

## 4. Segurança e privacidade

- Nenhum dado pessoal coletado: sem formulário, login, analytics ou cookies. Contato por `mailto`.
- Dados públicos de propósito: e-mail da empresa, CNPJ, e-mail pessoal, GitHub e LinkedIn do fundador (no portfólio).
- Adicionar analytics, formulário ou cookie exige spec e revisão de `seguranca.md` (LGPD e banner de consentimento).
- Modelo de ameaças completo em [`seguranca.md`](seguranca.md).

---

## 5. Stack

**Decidido:** manter o app existente em React Router v7 com SSR, em vez da landing Astro do padrão. Motivo e alternativas em [`adr/0001-stack.md`](adr/0001-stack.md).

- Site: React Router v7 (SSR), React 19, styled-components, GSAP, React Three Fiber. Detalhes em [`arquitetura-site.md`](arquitetura-site.md).
- **Compartilhado:** nenhum (app único, não é monorepo).
- **Dados:** nenhum banco. Conteúdo em arquivos TS (`src/i18n`, `src/config`).
- **Auth:** não há.
- **Hospedagem:** Netlify, plano grátis. Domínio na Cloudflare.
- **Branches:** direto na `main`; cada push publica em produção.

---

## 6. Design e identidade

- Nome: PRMA Code. Tom direto, sem exageros.
- **Identidade do handoff** (`docs/design_handoff_prma_code_brand_site/`), aprovada em 23/11/2026. Base e home aplicadas no plano 04 (spec 0005); layout do `/portfolio` no plano 05 (spec 0006).
  - Marca "P com cursor"; laranja `#E8743B` como cor de destaque; tokens claro/escuro do handoff.
  - Fontes Geist e Geist Mono (OFL), self-hosted em `public/fonts`. Sem Google Fonts.
  - Tema segue o sistema, com troca manual salva no `localStorage`. Sem seletor de cor (decisão do usuário, 23/11/2026).
  - Laranja nunca em texto pequeno sobre fundo claro; no claro, hover de link = sublinhado laranja.
  - O carrossel do portfólio continua em Three.js, não no CSS 3D do handoff (decisão do usuário, 23/11/2026). A melhoria da cena é a spec 0007.
- Portfólio com carrossel 3D (2 celulares + 1 laptop), página da empresa sem 3D.
- Rodapé: "CNPJ 45.056.853/0001-83" nos dois idiomas (decisão do usuário, 23/11/2026).

---

## 7. Escopo do MVP

**Dentro (no ar):**

- Página da empresa: hero, produtos, projetos para clientes, fundador, contato e rodapé com CNPJ.
- Portfólio em `/portfolio`.
- Inglês e português com troca de idioma.
- SEO básico: metas, OG, hreflang, JSON-LD, sitemap e robots.

**Depois:**

- Página por produto quando um app for lançado.
- Astro, só se surgir rotina de conteúdo.

---

## 8. Pendências

Resolvidas: e-mail contato@prmacode.dev recebendo; CNPJ no rodapé, só "CNPJ" nos dois idiomas (23/11/2026); inglês na raiz; plataformas do app (iOS · Android); sem blog; hospedagem na Netlify grátis.

Em aberto:

1. **Nome público do app de jogos.** Enquanto não sai, o card mostra "New app for gamers" / "Novo app para jogadores".
2. **Google Search Console.** Verificar o domínio (por DNS na Cloudflare) e enviar `https://prmacode.dev/sitemap.xml`. Só o usuário faz.
3. **Links para o site.** Colocar `prmacode.dev` no LinkedIn e no GitHub.
4. **Hospedagem na Cloudflare.** Reavaliar quando o domínio do NEXGG for comprado lá (Pages + Workers também têm plano grátis).
