import * as THREE from 'three';
import { L, roadX, smooth, paletteAt } from './math';

/** Rolling, vertex-coloured hills on either side of the road. */
export function createTerrain({ mobile }) {
  const zMax = 40;
  const zMin = -L - 90;

  const geo = new THREE.PlaneGeometry(190, zMax - zMin, mobile ? 90 : 150, mobile ? 180 : 300);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, (zMax + zMin) / 2);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    const distFromRoad = Math.abs(x - roadX(z));
    const m = smooth(6, 30, distFromRoad); // 0 on the road, 1 well away from it
    const noise =
      Math.sin(x * 0.09 + z * 0.05) * Math.cos(z * 0.07 - x * 0.03) +
      0.5 * Math.sin(x * 0.21 + z * 0.17) +
      0.25 * Math.sin(x * 0.5 - z * 0.37);
    const y = m * (noise * 3.2 + 6 * m) - 0.4;
    pos.setY(i, y);

    paletteAt(-z / L, c);
    const brightness = 0.18 + 0.75 * Math.min(Math.max(y / 11, 0), 1);
    colors.set([c.r * brightness, c.g * brightness, c.b * brightness], i * 3);
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
}
