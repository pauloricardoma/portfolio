# PRMA Code (site) — Produto

> Visão do site. As regras detalhadas ficam em `decisoes.md`.
> Última atualização: 22/11/2026.

## 1. Problema

A PRMA Code precisa de um site de empresa. Os programas de crédito para startups (Cloudflare for Startups, Microsoft for Startups, AWS Activate) pedem o site da empresa, e um portfólio pessoal passa a impressão de pessoa física. Além disso, quem procura o estúdio para um projeto precisa achar a empresa no Google e entender o que ela faz.

## 2. Para quem

- **Avaliadores dos programas de crédito:** leem em inglês e querem ver uma empresa real, com produto e CNPJ.
- **Potenciais clientes:** pessoas ou empresas que querem um app mobile ou web sob encomenda.
- **Quem busca o fundador:** recrutadores e contatos profissionais, pelo portfólio.

Sem restrição de idade. Público global (inglês) e Brasil (português).

## 3. Proposta

Uma página curta e verdadeira: quem é a PRMA Code, o que ela constrói e como falar com ela.

O diferencial é ser honesto e rápido de entender, com o portfólio do fundador como prova de capacidade técnica.

**Não é:**

- Blog ou site de conteúdo (não há rotina de escrita).
- Landing dos produtos. Cada app tem o próprio site (o NEXGG fica no projeto dele).
- Lugar para números, clientes, depoimentos ou parceiros que não existem.

## 4. MVP

Já está no ar. O visitante consegue:

1. Entender o que a PRMA Code é e faz, em inglês ou português.
2. Ver os produtos em construção (hoje, o app de jogos marcado como "em breve").
3. Saber que o estúdio aceita projetos de clientes e mandar um e-mail para contato@prmacode.dev.
4. Conhecer o fundador e navegar para o portfólio (projetos em 3D, skills, contato pessoal).
5. Encontrar o site no Google e compartilhar o link com prévia correta (SEO e Open Graph).

## 5. Depois do MVP

- Página por produto (`/products/<app>`) quando um app for lançado, com link para a landing própria.
- Revisitar Astro só se surgir rotina de conteúdo (ver `adr/0001-stack.md`).

## 6. Plataformas

| Plataforma | Para quê | App |
| --- | --- | --- |
| Web (SSR) | Site da empresa + portfólio | raiz do repositório |

## 7. Restrições

- **Custo:** zero. Hospedagem no plano grátis da Netlify; o domínio fica na Cloudflare.
- **Infra:** Netlify (SSR via functions), deploy automático a cada push na `main`.
- **Equipe:** uma pessoa (fundador).
- **Prazo:** nenhum. As melhorias de SEO entram como specs.

## 8. Monetização

Nenhuma. O site é vitrine da empresa e canal para projetos de clientes.

## 9. Idiomas

Inglês como padrão (raiz `/`) e português em `/pt`.
