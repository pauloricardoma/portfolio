/**
 * Geometria procedural dos aparelhos: retângulos arredondados (perfil de
 * celular, tela, tampa), extrudados com chanfro quando precisam de volume.
 */
import { BufferGeometry, ExtrudeGeometry, Shape, ShapeGeometry } from "three";

/** Retângulo de cantos arredondados centrado na origem */
export function roundedRectShape(width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  const x = -width / 2;
  const y = -height / 2;
  const shape = new Shape();

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * ShapeGeometry e ExtrudeGeometry geram UV nas coordenadas da forma.
 * Para a screenshot cobrir a tela de 0 a 1, os UVs são remapeados pela caixa.
 */
export function normalizeUVs<T extends BufferGeometry>(geometry: T) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;

  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (position.getX(i) - box.min.x) / width, (position.getY(i) - box.min.y) / height);
  }
  uv.needsUpdate = true;
  return geometry;
}

/** Superfície plana arredondada (tela, vidro, trackpad) com UV de 0 a 1 */
export function roundedPlane(width: number, height: number, radius: number, segments = 6) {
  return normalizeUVs(new ShapeGeometry(roundedRectShape(width, height, radius), segments));
}

/**
 * Bloco arredondado com chanfro: a espessura total é `depth`, centrada em z=0.
 * Grupos de material: 0 = faces da frente/trás, 1 = laterais (o aro).
 */
export function chamferedSlab(
  width: number,
  height: number,
  depth: number,
  radius: number,
  bevel: number
) {
  const geometry = new ExtrudeGeometry(roundedRectShape(width - bevel * 2, height - bevel * 2, radius), {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -(depth - bevel * 2) / 2);
  return geometry;
}
