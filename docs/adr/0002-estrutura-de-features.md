# ADR 0002 — Estrutura por página (MVVM)

- **Status:** aceito
- **Data:** 22/11/2026
- **Vale para:** todas as páginas do site (`src/pages/*`). Desvio do ADR de estrutura do kit (`features/<feature>/screens/`), registrado aqui.
- **Origem:** convenção que o projeto já seguia, mantida na reorganização de 22/11/2026.

## Contexto

O kit organiza apps com UI por feature e tela (`features/<feature>/screens/<tela>/`). Este site tem duas páginas, sem dados remotos e com pouco estado. A estrutura `features/` seria pasta demais para o tamanho dele, e o código já seguia MVVM por página.

## Decisão

Cada página é uma pasta em `src/pages/<page>/`:

```
pages/<page>/
├── <Page>.tsx          View: monta o Header e as seções, sem lógica
├── use<Page>.ts        ViewModel: idioma, dados resolvidos, itens do header
└── components/<Secao>/ <Secao>.tsx + styles.ts (+ componentes filhos da seção)
```

### Regras

1. A View não importa `src/config`, `src/i18n` nem dados: recebe tudo do ViewModel.
2. Seções recebem textos por props (`texts: IDictionary[...]`), não chamam `useLocale` por conta própria. Exceção: componentes do Shell (Header, LanguageToggle), que precisam da rota atual.
3. Um componente por arquivo, com `styles.ts` ao lado.
4. Uma página não importa de outra. O que for comum sobe para `src/components` (visual) ou `src/hooks`.
5. Pasta só existe com conteúdo.

## Consequências

- Para saber o que uma página usa, basta abrir a pasta dela.
- Algum estilo se repete entre páginas (ex.: hero da empresa e do portfólio). Aceito enquanto forem duas páginas; com uma terceira, extrair para `src/components`.
- Sem lint de fronteiras; as regras dependem de revisão.
