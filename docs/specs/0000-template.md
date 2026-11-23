# Spec {{NNN}} — {{Título}}

- **Status:** {{rascunho | aprovada | planejada | concluída | descartada}}
- **Pedido original:** "{{texto do pedido, como veio}}"
- **Data:** {{DD/MM/AAAA}}
- **Planos:** {{preenchido pelo /hefesto:plano}}

## 1. Problema

{{O que o usuário não consegue fazer hoje, ou o que está errado. Uma ou duas frases.}}

## 2. Comportamento esperado

{{Do ponto de vista de quem usa. Fluxo principal em passos numerados.}}

### Estados e transições

{{Se houver entidade com ciclo de vida: estados, quem muda cada um e o que acontece.}}

### Erros e casos de borda

| Situação | O que acontece | `code` devolvido |
| --- | --- | --- |
| {{situação}} | {{comportamento}} | `{{code_estavel}}` |

## 3. Regras de negócio

- {{regra}} (configurável em `{{chave}}`, se for número)

## 4. Contratos

{{Rotas, eventos ou mensagens novas, com o esboço do schema Zod. Apontar o pacote onde vão.}}

## 5. Dados

{{Tabelas e colunas novas ou alteradas, índices, migração e o que acontece com dados existentes.}}

## 6. Segurança e privacidade

- **Quem pode:** {{autorização por recurso}}
- **Entrada não confiável:** {{o que é validado e onde}}
- **Abuso:** {{rate limit, limites de tamanho, spam}}
- **Dados pessoais:** {{o que é coletado ou exposto, exclusão e exportação}}
- **Log:** {{o que nunca pode ir para log}}

(Se nada se aplica, escrever "sem impacto" com o motivo. Não deixar a seção vazia.)

## 7. UI e i18n

{{Telas afetadas, chaves de tradução novas e referência de design, se houver.}}

## 8. Critérios de aceite

- [ ] {{verificável por teste ou por um passo manual objetivo}}

## 9. Fora do escopo

- {{o que parece fazer parte, mas não faz}}

## 10. Perguntas abertas

- {{pergunta}} → {{resposta, quando houver}}
