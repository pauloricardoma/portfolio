# Plano 02 — Seção 3D de Projetos

## Objetivo
Criar a seção de showcase de projetos com dispositivos 3D (2 celulares + 1 MacBook) em um carrossel orbital interativo usando React Three Fiber.

---

## Fase 1: Setup do 3D

### 1.1 Instalar dependências
- [ ] `@react-three/fiber` — renderer React para Three.js (permite escrever Three.js como JSX)
- [ ] `@react-three/drei` — helpers prontos (OrbitControls, modelos, HTML overlay, etc.)
- [ ] `three` — engine 3D base (peer dependency do fiber)
- [ ] `@types/three` — tipos TypeScript

### 1.2 Estrutura de pastas para 3D
```
src/
├── components/
│   └── 3D/                    # Componentes 3D globais reutilizáveis
│       ├── DevicePhone.tsx     # Modelo 3D do celular
│       ├── DeviceLaptop.tsx    # Modelo 3D do MacBook
│       └── Scene.tsx           # Wrapper da cena 3D (Canvas + lights)
├── pages/
│   └── home/
│       └── components/
│           ├── ProjectsSection.tsx      # Seção completa
│           ├── ProjectsCarousel.tsx     # Carrossel 3D orbital
│           └── ProjectDescription.tsx   # Card de descrição do projeto
```

---

## Fase 2: Modelos 3D dos Dispositivos

### 2.1 Celular 3D
- [ ] Criar geometria do celular com Three.js primitives (BoxGeometry + bordas arredondadas)
  - Alternativa: usar modelo GLTF free de smartphone
- [ ] Aplicar textura da tela (screenshot do app) como material na face frontal
- [ ] Adicionar reflexo/brilho sutil nas bordas (material metálico)

### 2.2 MacBook 3D
- [ ] Criar geometria do MacBook (base + tela com dobradiça)
  - Alternativa: usar modelo GLTF free de laptop
- [ ] Aplicar textura da tela (screenshot do app web) como material
- [ ] Animação sutil de "respiração" (leve hover float)

### 2.3 Texturas e screenshots
- [ ] Definir local para os screenshots dos apps (`public/projects/`)
- [ ] Criar sistema para trocar screenshots dinamicamente por projeto

---

## Fase 3: Carrossel Orbital

### 3.1 Mecânica do carrossel
- [ ] Posicionar os 3 dispositivos em círculo (distribuídos a cada 120°)
- [ ] Rotação orbital: os dispositivos orbitam em torno de um ponto central
  - Pode ser por drag (arrastar) ou por click/botão para avançar
- [ ] Rotação individual: cada dispositivo gira suavemente no próprio eixo (auto-rotate)
- [ ] O dispositivo da frente (mais próximo da câmera) fica maior/em destaque

### 3.2 Interatividade
- [ ] Drag para girar o carrossel (ou swipe em mobile)
- [ ] Click no dispositivo para trazer ele para frente
- [ ] Transição suave (spring animation) ao mudar o item em foco
- [ ] Responsividade: ajustar posições e escala para mobile

### 3.3 Iluminação da cena
- [ ] Ambient light suave (iluminação base)
- [ ] Point light ou spot light para destacar o dispositivo em foco
- [ ] Sombras sutis para dar profundidade

---

## Fase 4: Integração com descrição do projeto

### 4.1 Overlay HTML sobre 3D
- [ ] Usar `Html` do @react-three/drei para posicionar descrição ao lado do dispositivo em foco
  - Alternativa: descrição fora do Canvas, sincronizada via state
- [ ] Card com: nome do projeto, tecnologias, breve descrição, link (se tiver)
- [ ] Animação de entrada/saída do card ao trocar o projeto em foco

### 4.2 Dados dos projetos
- [ ] Criar interface `IProject` em `src/interfaces/home/`
- [ ] Criar array de projetos com: nome, descrição, techs, tipo (mobile/web), screenshot path

---

## Fase 5: Animação de scroll da seção

### 5.1 Entrada da seção
- [ ] A cena 3D aparece com fade + scale suave ao scrollar até ela
- [ ] Título "Projetos" entra com animação antes dos dispositivos
- [ ] Os dispositivos entram em cena com stagger (um por um)

---

## Dependências a instalar
```
yarn add three @react-three/fiber @react-three/drei
yarn add -D @types/three
```

## Conceitos Three.js que serão usados (para a entrevista)
- **Scene**: container de todos os objetos 3D
- **Camera**: ponto de vista (usaremos PerspectiveCamera)
- **Mesh**: objeto 3D = Geometry (forma) + Material (aparência)
- **Texture**: imagem aplicada em um material (os screenshots)
- **Raycasting**: como o Three.js detecta cliques em objetos 3D
- **requestAnimationFrame**: loop de renderização (R3F abstrai isso)
- **GSAP + Three.js**: GSAP pode animar propriedades de objetos 3D (posição, rotação, escala) diretamente
