import * as THREE from 'three';
import { L, roadX } from './math';

/** Asphalt strip, glowing edge rails and centre dashes. */
export function createRoad() {
  const group = new THREE.Group();

  const verts = [];
  const indices = [];
  const leftRail = [];
  const rightRail = [];
  let row = 0;

  for (let z = 40; z >= -L - 90; z -= 1) {
    const x = roadX(z);
    const slope = roadX(z - 1) - x; // x change per unit forward
    const len = Math.hypot(1, slope);
    const nx = 1 / len; // perpendicular to the road direction
    const nz = slope / len;

    verts.push(x - nx * 3.4, 0.02, z - nz * 3.4, x + nx * 3.4, 0.02, z + nz * 3.4);
    if (row > 0) {
      const a = (row - 1) * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    row++;

    if (z % 3 === 0) {
      leftRail.push(new THREE.Vector3(x - nx * 3.3, 0.18, z - nz * 3.3));
      rightRail.push(new THREE.Vector3(x + nx * 3.3, 0.18, z + nz * 3.3));
    }
  }

  // asphalt
  const surface = new THREE.BufferGeometry();
  surface.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  surface.setIndex(indices);
  surface.computeVertexNormals();
  group.add(new THREE.Mesh(surface, new THREE.MeshLambertMaterial({ color: 0x2a2433, side: THREE.DoubleSide })));

  // edge rails
  const railMaterial = new THREE.MeshBasicMaterial({ color: 0xffd6ec });
  [leftRail, rightRail].forEach((points) => {
    const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), points.length * 2, 0.11, 5);
    group.add(new THREE.Mesh(tube, railMaterial));
  });

  // centre dashes
  const dashCount = Math.ceil((L + 130) / 6);
  const dashes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.22, 0.05, 2.2),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    dashCount,
  );
  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const unit = new THREE.Vector3(1, 1, 1);
  let k = 0;
  for (let z = 40; z >= -L - 90 && k < dashes.count; z -= 6, k++) {
    const x = roadX(z);
    quat.setFromAxisAngle(up, -Math.atan(roadX(z - 1) - x));
    matrix.compose(new THREE.Vector3(x, 0.06, z), quat, unit);
    dashes.setMatrixAt(k, matrix);
  }
  group.add(dashes);

  return group;
}
