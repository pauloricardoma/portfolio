/**
 * DevicePhone.tsx — Modelo 3D de um smartphone.
 *
 * CONCEITOS THREE.JS USADOS:
 *
 * 1. Mesh = Geometry + Material
 *    - Geometry: a forma 3D (cubo, esfera, cilindro, etc.)
 *    - Material: a aparência (cor, brilho, reflexo, textura)
 *    Um mesh é um objeto visível na cena.
 *
 * 2. RoundedBox (do @react-three/drei)
 *    - Um BoxGeometry com bordas arredondadas.
 *    - Three.js puro só tem BoxGeometry com cantos retos.
 *    - drei resolve isso com uma geometria customizada.
 *    - args: [largura, altura, profundidade]
 *    - radius: raio do arredondamento das bordas
 *
 * 3. Materiais:
 *    - meshStandardMaterial: material PBR (Physically Based Rendering)
 *      que reage à luz de forma realista. Tem propriedades:
 *      - color: cor base
 *      - metalness: 0=plástico, 1=metal (reflete o ambiente)
 *      - roughness: 0=espelho, 1=fosco
 *    - meshBasicMaterial: material que NÃO reage à luz (sempre flat).
 *      Usado na tela porque queremos que o screenshot apareça
 *      sem ser escurecido pelas sombras.
 *
 * 4. useTexture (do drei):
 *    Carrega uma imagem e converte pra THREE.Texture automaticamente.
 *    A textura é aplicada na prop "map" do material.
 *    "map" = mapeamento de textura (imagem → superfície 3D).
 *
 * 5. Group (<group>):
 *    Container que agrupa múltiplos meshes.
 *    Mover/rotacionar o group move todos os filhos juntos.
 *    Equivale a um <div> no HTML — organização hierárquica.
 *
 * 6. position: [x, y, z]
 *    - x: horizontal (esquerda/direita)
 *    - y: vertical (cima/baixo)
 *    - z: profundidade (frente/trás, em direção à câmera)
 *    Cada unidade no Three.js não tem medida real — é relativa.
 */
import { useRef } from "react";
import { RoundedBox, Ring } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import type { Group } from "three";

interface DevicePhoneProps {
  /** Caminho pro screenshot do app (em /public/) */
  screenTexture: string;
  /** Cor da carcaça do celular (hex string, ex: "#1a1a2e") */
  color?: string;
  /** Posição no espaço 3D [x, y, z] */
  position?: [number, number, number];
  /** Rotação em radianos [x, y, z] */
  rotation?: [number, number, number];
  /** Escala uniforme */
  scale?: number;
}

/** Proporções do celular (baseado em iPhone ~6.1") */
const PHONE_WIDTH = 1.0;
const PHONE_HEIGHT = 2.1;
const PHONE_DEPTH = 0.08;
const SCREEN_INSET = 0.06;

export default function DevicePhone({
  screenTexture,
  color = "#1a1a2e",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.3,
}: DevicePhoneProps) {
  const groupRef = useRef<Group>(null);

  /**
   * useTexture — Carrega a imagem do screenshot como uma textura 3D.
   * Internamente, faz: new THREE.TextureLoader().load(url)
   * E já cuida do loading/caching automaticamente.
   */
  const texture = useTexture(screenTexture);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/**
       * CORPO DO CELULAR (carcaça)
       *
       * RoundedBox: caixa com bordas arredondadas.
       * args={[largura, altura, profundidade]}
       * radius={0.06}: raio do arredondamento — simula cantos do iPhone.
       * smoothness={4}: quantidade de segmentos nas curvas (mais = mais suave).
       *
       * Material: meshStandardMaterial com metalness alto (0.8)
       * pra dar aquele brilho metálico de alumínio.
       * roughness 0.2 = quase espelhado, reflete a luz.
       * color "#1a1a2e": azul escuro quase preto (como um iPhone Pro).
       */}
      <RoundedBox args={[PHONE_WIDTH, PHONE_HEIGHT, PHONE_DEPTH]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.2} />
      </RoundedBox>

      {/**
       * TELA DO CELULAR
       *
       * Um plano (planeGeometry) posicionado levemente à frente do corpo (z=0.041).
       * Precisa estar FORA do corpo pra não ficar "dentro" dele.
       *
       * planeGeometry args={[largura, altura]}: retângulo 2D.
       * Menor que o corpo (SCREEN_INSET) pra simular a moldura/bezel.
       *
       * meshBasicMaterial com map={texture}:
       * - "map" é a prop que aplica uma textura (imagem) no material.
       * - meshBasicMaterial pra tela: NÃO reage à luz.
       *   Isso é proposital — telas de celular emitem luz própria,
       *   então não faz sentido elas ficarem mais escuras por sombra.
       * - toneMapped={false}: desativa o tone mapping do renderer.
       *   Sem isso, as cores da textura ficam "lavadas" (dessaturadas).
       */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[PHONE_WIDTH - SCREEN_INSET, PHONE_HEIGHT - SCREEN_INSET]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/**
       * MÓDULO DE CÂMERA TRASEIRA (estilo iPhone Pro)
       *
       * Composto por:
       * 1. Bloco retangular arredondado (o "island" da câmera)
       * 2. 3 lentes circulares dispostas em triângulo
       *
       * Tudo posicionado em z NEGATIVO (parte de trás do celular).
       * z = -(PHONE_DEPTH/2 + espessura) pra ficar atrás da carcaça.
       *
       * As lentes usam:
       * - circleGeometry: disco 2D (a lente escura)
       * - Ring (drei): anel circular (a borda metálica ao redor da lente)
       *
       * Ring args={[innerRadius, outerRadius, segments]}:
       * - innerRadius: raio do buraco interno
       * - outerRadius: raio externo do anel
       * - segments: quantidade de segmentos (32 = círculo suave)
       */}
      <group position={[-0.18, PHONE_HEIGHT / 2 - 0.32, -(PHONE_DEPTH / 2)]}>
        {/* Island da câmera — bloco arredondado que contém as lentes */}
        <RoundedBox args={[0.38, 0.38, 0.02]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.15} />
        </RoundedBox>

        {/* Lente superior esquerda */}
        <group position={[-0.08, 0.08, -0.011]}>
          <mesh>
            <circleGeometry args={[0.055, 32]} />
            <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
          </mesh>
          <Ring args={[0.055, 0.07, 32]} position={[0, 0, 0.001]}>
            <meshStandardMaterial color="#888899" metalness={0.8} roughness={0.2} />
          </Ring>
        </group>

        {/* Lente superior direita */}
        <group position={[0.08, 0.08, -0.011]}>
          <mesh>
            <circleGeometry args={[0.055, 32]} />
            <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
          </mesh>
          <Ring args={[0.055, 0.07, 32]} position={[0, 0, 0.001]}>
            <meshStandardMaterial color="#888899" metalness={0.8} roughness={0.2} />
          </Ring>
        </group>

        {/* Lente inferior central */}
        <group position={[-0.08, -0.08, -0.011]}>
          <mesh>
            <circleGeometry args={[0.055, 32]} />
            <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
          </mesh>
          <Ring args={[0.055, 0.07, 32]} position={[0, 0, 0.001]}>
            <meshStandardMaterial color="#888899" metalness={0.8} roughness={0.2} />
          </Ring>
        </group>

        {/* Flash LED — pequeno círculo dourado */}
        <mesh position={[0.08, -0.08, -0.011]}>
          <circleGeometry args={[0.025, 32]} />
          <meshStandardMaterial color="#E8C86A" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
