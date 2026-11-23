/**
 * Scene.tsx — Wrapper da cena 3D.
 *
 * CONCEITOS THREE.JS / REACT THREE FIBER:
 *
 * No Three.js puro, você criaria:
 *   const scene = new THREE.Scene()
 *   const camera = new THREE.PerspectiveCamera(...)
 *   const renderer = new THREE.WebGLRenderer()
 *   renderer.render(scene, camera)
 *
 * O React Three Fiber (R3F) abstrai tudo isso com o componente <Canvas>.
 * O <Canvas> cria automaticamente:
 *   - Uma Scene (container de todos os objetos 3D)
 *   - Uma PerspectiveCamera (ponto de vista do usuário)
 *   - Um WebGLRenderer (motor de renderização)
 *   - Um loop de animação (requestAnimationFrame) que re-renderiza a cada frame
 *
 * Dentro do <Canvas>, você escreve JSX que representa objetos 3D.
 * Cada tag JSX corresponde a uma classe do Three.js:
 *   <mesh> → new THREE.Mesh()
 *   <boxGeometry> → new THREE.BoxGeometry()
 *   <meshStandardMaterial> → new THREE.MeshStandardMaterial()
 *
 * ILUMINAÇÃO:
 * Sem luz, objetos 3D ficam pretos (exceto emissivos).
 * - ambientLight: luz uniforme em todas as direções (sem sombra)
 * - pointLight: luz que emana de um ponto (como uma lâmpada)
 * - spotLight: luz direcional em cone (como um holofote)
 *
 * O "intensity" controla a força da luz.
 * O "position" é um array [x, y, z] no espaço 3D.
 */
import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import type { ThemeMode } from "~/styles/tokens";

interface SceneProps {
  children: ReactNode;
  className?: string;
  /** O fundo do palco muda com o tema; a luz acompanha para os aparelhos não sumirem */
  themeMode: ThemeMode;
}

/**
 * Luz por tema: no claro, o fundo branco faz o grafite parecer um recorte preto,
 * então a cena recebe mais luz ambiente e um key light mais forte.
 */
const LIGHTS: Record<ThemeMode, { ambient: number; key: number; fill: number }> = {
  light: { ambient: 1.1, key: 1.6, fill: 0.8 },
  dark: { ambient: 0.6, key: 1, fill: 0.4 },
};

export default function Scene({ children, className, themeMode }: SceneProps) {
  const lights = LIGHTS[themeMode];

  return (
    <Canvas
      className={className}
      /**
       * camera.position: [x, y, z] — posição da câmera no espaço 3D.
       * [0, 0, 8] = câmera no centro (x=0, y=0), 8 unidades afastada (z=8).
       * Quanto maior o z, mais longe a câmera fica dos objetos.
       *
       * fov (Field of View): ângulo de visão em graus.
       * 45° é natural (parecido com olho humano).
       * Menor = zoom, Maior = grande angular.
       */
      camera={{ position: [0, 0, 8], fov: 45 }}
      /**
       * dpr: Device Pixel Ratio — resolução de renderização.
       * [1, 1.5] = limita a 1.5x mesmo em telas 2x/3x.
       * 1.5x é o sweet spot: visualmente quase igual a 2x,
       * mas renderiza ~56% menos pixels (1.5² vs 2² = 2.25 vs 4).
       * Em mobile (GPU fraca), essa diferença é enorme.
       */
      dpr={[1, 1.5]}
      /**
       * gl: configurações do WebGL renderer.
       * antialias: DESATIVADO — caro em GPUs mobile. Com dpr 1.5x
       * a densidade de pixels já suaviza bastante as bordas.
       * powerPreference "high-performance": pede a GPU dedicada
       * quando disponível (em laptops com 2 GPUs).
       * alpha: fundo transparente (mostra o background do CSS por trás).
       */
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      {/**
       * ambientLight: luz ambiente — ilumina todos os objetos igualmente.
       * Sem ela, as faces não voltadas pra luz ficariam 100% pretas.
       * intensity 0.6 = suave, não "achata" as sombras.
       */}
      <ambientLight intensity={lights.ambient} />

      {/**
       * pointLight: luz pontual em [5, 5, 5] (canto superior direito frontal).
       * Cria sombras e highlights que dão volume aos objetos.
       * intensity 1 = intensidade normal.
       */}
      <pointLight position={[5, 5, 5]} intensity={lights.key} />

      {/**
       * Segunda luz do lado oposto [-3, -2, 4] (canto inferior esquerdo).
       * "Fill light" — suaviza as sombras do lado oposto à luz principal.
       * intensity 0.4 = bem fraca, só pra não ficar 100% escuro.
       */}
      <pointLight position={[-3, -2, 4]} intensity={lights.fill} />

      {children}
    </Canvas>
  );
}
