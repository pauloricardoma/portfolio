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

interface SceneProps {
  children: ReactNode;
  className?: string;
}

export default function Scene({ children, className }: SceneProps) {
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
       * [1, 2] = usa até 2x em telas retina (nítido sem gastar demais).
       * Em telas 3x (iPhones), limita a 2x pra manter performance.
       */
      dpr={[1, 2]}
      /**
       * gl: configurações do WebGL renderer.
       * antialias: suaviza bordas serrilhadas dos objetos 3D.
       * alpha: fundo transparente (mostra o background do CSS por trás).
       */
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/**
       * ambientLight: luz ambiente — ilumina todos os objetos igualmente.
       * Sem ela, as faces não voltadas pra luz ficariam 100% pretas.
       * intensity 0.6 = suave, não "achata" as sombras.
       */}
      <ambientLight intensity={0.6} />

      {/**
       * pointLight: luz pontual em [5, 5, 5] (canto superior direito frontal).
       * Cria sombras e highlights que dão volume aos objetos.
       * intensity 1 = intensidade normal.
       */}
      <pointLight position={[5, 5, 5]} intensity={1} />

      {/**
       * Segunda luz do lado oposto [-3, -2, 4] (canto inferior esquerdo).
       * "Fill light" — suaviza as sombras do lado oposto à luz principal.
       * intensity 0.4 = bem fraca, só pra não ficar 100% escuro.
       */}
      <pointLight position={[-3, -2, 4]} intensity={0.4} />

      {children}
    </Canvas>
  );
}
