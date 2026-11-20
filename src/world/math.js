import * as THREE from 'three';

/** Length of the drive (world units). Scrolling the page moves the camera along it. */
export const L = 330;

/** Where the camera sits on the z axis for scroll progress p (0 → 1). */
export const camZ = (p) => 8 - p * L;

/** Sideways wiggle of the road at depth z. */
export const roadX = (z) => Math.sin(z * 0.03) * 7 + Math.sin(z * 0.0123 + 1) * 9;

export const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Colour journey along the road: pink → lavender → blue → mint → pink. */
const PALETTE = ['#ff8cc6', '#c39bff', '#7cc8ff', '#8fe8c6', '#ff8cc6'].map((c) => new THREE.Color(c));

export function paletteAt(t, out) {
  t = Math.min(Math.max(t, 0), 0.9999) * (PALETTE.length - 1);
  const i = Math.floor(t);
  return out.copy(PALETTE[i]).lerp(PALETTE[i + 1], t - i);
}

/**
 * Put `obj` on the road, `ahead` units in front of where the camera is at progress p,
 * `lateral` units off-centre and `y` units up, rotated to follow the road's direction.
 */
export function placeOnRoad(obj, p, ahead, lateral = 0, y = 0) {
  const z = camZ(p) - ahead;
  const x = roadX(z);
  obj.position.set(x + lateral, y, z);
  obj.rotation.y = -Math.atan(roadX(z - 1) - x);
}
