import * as THREE from 'three';

/**
 * The 3D objects that sit beside the road, one per page section:
 *   hero → torus knot, about → d20, projects → loot crates,
 *   experience → checkpoint gates, contact → wireframe core.
 * Positions are assigned later by the world's layout() so they line up with the page.
 */
export function createSetPieces({ gateCount }) {
  const normalMaterial = new THREE.MeshNormalMaterial({ flatShading: true });

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.4, 0.75, 180, 24), new THREE.MeshNormalMaterial());

  const d20 = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 0), normalMaterial);

  const crates = createCrates(normalMaterial);

  const checker = createCheckerTexture();
  const gateColors = [0xff8cc6, 0x9fd8ff, 0xffffff];
  const gates = Array.from({ length: gateCount }, (_, i) =>
    createGate(checker, gateColors[i % gateColors.length], i === gateCount - 1),
  );

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(7, 1),
    new THREE.MeshBasicMaterial({ color: 0xffc8e6, wireframe: true }),
  );

  const group = new THREE.Group();
  group.add(knot, d20, crates, ...gates, core);

  /** Called every frame. */
  function update(time, dt) {
    knot.rotation.x = time * 0.25;
    knot.rotation.z = time * 0.15;

    d20.rotation.x = time * 0.35;
    d20.rotation.z = time * 0.2;

    crates.children.forEach((c) => {
      c.rotation.x += c.userData.spin.x * dt;
      c.rotation.y += c.userData.spin.y * dt;
      c.position.y = c.userData.y0 + Math.sin(time + c.userData.phase) * 0.4;
    });

    core.rotation.y = time * 0.1;
    core.rotation.x = time * 0.06;
  }

  return { group, knot, d20, crates, gates, core, update };
}

function createCrates(material) {
  const group = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const size = 0.6 + Math.random() * 1.3;
    const crate = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), material);
    crate.position.set((Math.random() - 0.5) * 22, 1.5 + Math.random() * 8, (Math.random() - 0.5) * 24);
    if (Math.abs(crate.position.x) < 4.5) crate.position.x += Math.sign(crate.position.x || 1) * 5; // keep the road clear
    crate.userData.spin = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.6);
    crate.userData.y0 = crate.position.y;
    crate.userData.phase = Math.random() * 6;
    group.add(crate);
  }
  return group;
}

function createCheckerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 32;
  const g = canvas.getContext('2d');
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 2; y++) {
      g.fillStyle = (x + y) % 2 ? '#111' : '#fff';
      g.fillRect(x * 16, y * 16, 16, 16);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

/** A checkpoint arch with a chequered banner. The last one is the white finish line. */
function createGate(checker, color, isFinish) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color });

  const postGeometry = new THREE.BoxGeometry(0.45, 7.5, 0.45);
  const left = new THREE.Mesh(postGeometry, material);
  left.position.set(-5.2, 3.75, 0);
  const right = new THREE.Mesh(postGeometry, material);
  right.position.set(5.2, 3.75, 0);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(11, 0.5, 0.45), material);
  beam.position.y = 7.5;

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 1.25),
    new THREE.MeshBasicMaterial({ map: checker, side: THREE.DoubleSide, color: isFinish ? 0xffffff : color }),
  );
  banner.position.y = 6.6;

  group.add(left, right, beam, banner);
  return group;
}
