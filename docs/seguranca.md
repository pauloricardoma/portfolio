# PRMA Code (site) — Segurança (modelo de ameaças)

> Lido antes de qualquer spec que adicione formulário, analytics, cookies, integração ou dependência nova.
> Última atualização: 22/11/2026.

## 1. O que protegemos

| Ativo | Por que importa | Onde fica |
| --- | --- | --- |
| Integridade do site | Desfiguração ou script injetado atinge visitantes e a reputação da empresa | Repositório GitHub, deploy na Netlify |
| Conta da Netlify, do GitHub e da Cloudflare (domínio/DNS) | Quem controla deploy ou DNS controla o site e o e-mail | Contas do fundador |
| Caixa contato@prmacode.dev | Canal comercial; e-mail público atrai spam e phishing | Provedor de e-mail |

Não há dados de usuários: sem formulário, login, banco, analytics nem cookies.

## 2. Quem pode atacar

- **Atacante externo** sem conta: tenta injetar script (XSS), clickjacking, ou explorar dependência vulnerável no SSR.
- **Cadeia de dependências:** pacote npm comprometido entra no build e no bundle.
- **Tomada de conta** (GitHub, Netlify, Cloudflare): publica conteúdo malicioso ou desvia o domínio.
- **Spam e phishing** no e-mail público.

## 3. Fronteiras de confiança

- Visitante → servidor SSR: a única entrada é a URL (caminho). O caminho só decide o idioma e a rota; nada dele é renderizado como HTML.
- Repositório → build na Netlify: tudo o que está na `main` vai para produção.
- Todo conteúdo do site vem de arquivos do repositório (`src/i18n`, `src/config`). Não há conteúdo de terceiros renderizado.

## 4. Regras permanentes

- Nada de `dangerouslySetInnerHTML` com dado que não seja do próprio repositório. JSON-LD vai pelo `meta()` do React Router.
- Links externos com `target="_blank"` levam `rel="noopener noreferrer"`.
- Segredos não existem hoje. Se surgirem, ficam em variável de ambiente da Netlify, nunca no cliente nem no repositório. O Claude não lê `.env*`.
- Dependência nova: conferir manutenção, popularidade e scripts de instalação.
- 2FA nas contas do GitHub, da Netlify, da Cloudflare e do e-mail.
- Formulário, analytics ou cookie novo: exige spec, revisão deste documento e, se coletar dado pessoal, política de privacidade e consentimento (LGPD).

## 5. Riscos conhecidos e decisões

| Risco | Decisão | Spec / plano |
| --- | --- | --- |
| Sem headers de segurança (CSP, HSTS, X-Frame-Options) | Resolvido: CSP com nonce e headers do HTML no SSR (`entry.server`, `src/config/security.ts`); cache e headers dos estáticos no `netlify.toml` (ADR 0005) | spec 0003 |
| `style-src 'unsafe-inline'` na CSP | Aceito (23/11/2026): o styled-components injeta `<style>` e há atributos `style`; sem entrada de usuário, o risco de injeção de estilo é baixo. Scripts seguem só com nonce | spec 0003 |
| E-mail pessoal público no portfólio | Aceito: escolha do fundador, contato profissional | — |
| Dependências desatualizadas | Revisar com `yarn audit` antes de cada mudança grande | — |

## 6. Antes de cada mudança grande

- [ ] `yarn audit` sem vulnerabilidade alta ou crítica em dependência de runtime.
- [ ] Nenhum dado pessoal novo coletado sem spec.
- [ ] Headers de segurança conferidos em produção: `curl -I https://prmacode.dev/` com CSP (nonce muda a cada chamada), um HSTS só, `Cache-Control: no-store` no HTML; `immutable` em `/assets/*`.
- [ ] Cloudflare: sem "Cache Everything" no HTML; Rocket Loader, Zaraz, Web Analytics e Email Obfuscation desligados (injetam script ou reescrevem o HTML e quebram a CSP).
- [ ] Script inline novo com o nonce (`NonceContext`); conferido com `NODE_ENV=production yarn start` sem violação de CSP no console.
