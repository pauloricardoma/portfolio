# Plano 03 — Skills + Contato

## Objetivo
Criar a seção de habilidades técnicas e a seção de contato, ambas com animações de scroll consistentes com o resto do portfólio.

---

## Fase 1: Seção de Skills

### 1.1 Estrutura
```
src/pages/home/components/
├── SkillsSection.tsx        # Seção completa
├── SkillCard.tsx             # Card individual de skill
└── SkillCategory.tsx         # Agrupamento por categoria
```

### 1.2 Layout e design
- [ ] Definir categorias (ex: Frontend, 3D/Animação, Ferramentas, etc.)
- [ ] Cards de skill com ícone/logo + nome + nível de proficiência (opcional)
- [ ] Layout em grid responsivo
- [ ] Design consistente com o design system (cores, spacing, tipografia)

### 1.3 Animações (GSAP ScrollTrigger)
- [ ] Cards entrando com stagger animation no scroll (`gsap.from` com `stagger` + `ScrollTrigger`)
- [ ] Hover sutil nos cards (scale + shadow ou glow com a cor primary — via styled-components transitions)
- [ ] Barra de proficiência animada (se usar) — `gsap.to` width ao entrar na viewport via ScrollTrigger

---

## Fase 2: Seção de Contato

### 2.1 Estrutura
```
src/pages/home/components/
├── ContactSection.tsx       # Seção completa
└── ContactLink.tsx          # Link individual (email, github, linkedin)
```

### 2.2 Layout e design
- [ ] Título + frase convidativa
- [ ] Links de contato: Email, GitHub, LinkedIn (ícones + texto)
- [ ] Design clean, pode ter fundo diferenciado (usar surface do tema)
- [ ] Footer simples abaixo

### 2.3 Animações (GSAP)
- [ ] Entrada com fade + slide up ao scrollar (`gsap.from` + `ScrollTrigger`)
- [ ] Hover nos links com animação sutil (styled-components transitions)
- [ ] Possível: partículas ou efeito 3D sutil no background (opcional, se sobrar tempo)

---

## Fase 3: Navegação e polish final

### 3.1 Header/Navegação
- [ ] Criar componente `Header` em `components/Shell/`
- [ ] Navegação fixa com scroll suave para cada seção (anchor links)
- [ ] Header com backdrop blur que aparece após scrollar o Hero
- [ ] Toggle de tema (light/dark) no header
- [ ] Menu hamburger para mobile

### 3.2 Transições entre seções
- [ ] Garantir consistência de animações entre todas as seções
- [ ] Testar performance (especialmente com o 3D ativo)
- [ ] Testar responsividade em todos os breakpoints

### 3.3 SEO e meta
- [ ] Atualizar meta tags (título, descrição, og:image)
- [ ] Adicionar favicon personalizado

---

## Ordem de execução sugerida
1. Skills (mais simples, complementa o conteúdo)
2. Contato (seção final)
3. Header/Navegação (conecta tudo)
4. Polish e testes finais
