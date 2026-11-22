import * as THREE from 'three';
import { L, camZ, roadX, placeOnRoad } from './math';
import { createTerrain } from './terrain';
import { createRoad } from './road';
import { createSetPieces } from './setPieces';
import { createAsciiPass } from './asciiPass';
import { prefersReducedMotion } from '../lib/env';

const NOOP_WORLD = { kick() {}, setDark() {}, layout() {}, dispose() {} };

/**
 * Builds the whole 3D scene and starts rendering it. This is plain Three.js; React only
 * calls it once (see hooks/useWorld.js) and talks to it through the returned handle.
 *
 * @param {object}   opts
 * @param {HTMLElement} opts.container        element the <canvas> is appended to
 * @param {number}   opts.checkpointCount     how many checkpoint gates to build
 * @param {boolean}  opts.initialDark         start in night mode
 * @param {Function} opts.getLayoutTargets    () => ({ about, projects, checkpoints[] }) DOM elements
 *                                            used to line 3D objects up with page sections
 * @param {Function} [opts.onFrame]           ({ speed, progress }) called every frame (for the HUD)
 * @param {Function} [opts.onReady]           called after the first frame
 * @param {Function} [opts.onFail]            called if WebGL is unavailable
 * @returns {{ kick(amount:number), setDark(dark:boolean), layout(), dispose() }}
 */
export function createWorld({ container, checkpointCount, initialDark, getLayoutTargets, onFrame, onReady, onFail }) {
  const mobile = innerWidth < 760;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  // Viewport size used for the 3D scene. On phones the browser's address bar slides in and
  // out while scrolling, which changes innerHeight by ~50–100px and fires `resize`. Reacting
  // to that re-creates the canvas and shifts every object, which looks like glitching. So on
  // touch devices we only ever grow the height (until the width changes, e.g. rotation).
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  let vw = innerWidth;
  let vh = innerHeight;
  function measureViewport() {
    if (coarsePointer && innerWidth === vw) {
      vh = Math.max(vh, innerHeight);
    } else {
      vw = innerWidth;
      vh = innerHeight;
    }
  }

  // ---------------- renderer ----------------
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  } catch (err) {
    console.error(err);
    canvas.remove();
    onFail?.(err);
    return NOOP_WORLD;
  }
  renderer.setPixelRatio(dpr);
  renderer.setSize(vw, vh);

  // ---------------- scene ----------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 16, 105);

  const camera = new THREE.PerspectiveCamera(62, vw / vh, 0.1, 200);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-12, 20, 8);
  scene.add(sun);

  scene.add(createTerrain({ mobile }));
  scene.add(createRoad());
  const pieces = createSetPieces({ gateCount: checkpointCount });
  scene.add(pieces.group);

  const ascii = createAsciiPass({ mobile, dpr, dark: initialDark });

  // ---------------- layout: line 3D objects up with the page ----------------
  let maxScroll = 1;

  // Scroll progress (0 → 1) at which `el` is centred on screen.
  const progressOf = (el) => {
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const center = r.top + scrollY + r.height / 2 - vh / 2;
    return Math.min(Math.max(center / maxScroll, 0), 1);
  };

  function layout() {
    const targets = getLayoutTargets();
    maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);

    placeOnRoad(pieces.knot, 0, 20, 0, 8.5);
    placeOnRoad(pieces.d20, progressOf(targets.about), 13, mobile ? 0 : -5.5, 5);
    placeOnRoad(pieces.crates, progressOf(targets.projects), 16, 0, 0);
    targets.checkpoints.forEach((el, i) => pieces.gates[i] && placeOnRoad(pieces.gates[i], progressOf(el), 9));
    placeOnRoad(pieces.core, 1, 34, 0, 9);
  }

  function resize() {
    renderer.setSize(vw, vh);
    camera.aspect = vw / vh;
    camera.fov = vw < vh ? 75 : 62;
    camera.updateProjectionMatrix();
    ascii.setSize(vw, vh);
    layout();
  }

  // ---------------- state driven from outside ----------------
  let darkTarget = initialDark ? 1 : 0;
  let glitch = 0;
  let nextRandomGlitch = 6;
  const reduceMotion = prefersReducedMotion();

  const kick = (amount) => {
    if (!reduceMotion) glitch = Math.max(glitch, amount);
  };
  const setDark = (dark) => {
    darkTarget = dark ? 1 : 0;
  };

  // ---------------- input ----------------
  const pointer = new THREE.Vector2();
  const onPointerMove = (e) => pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);

  let progress = 0; // target scroll progress
  const onScroll = () => {
    progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
  };
  const onResize = () => {
    const prevW = vw;
    const prevH = vh;
    measureViewport();
    if (vw === prevW && vh === prevH) return; // e.g. address bar toggling on a phone
    resize();
    onScroll();
  };

  addEventListener('pointermove', onPointerMove);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);

  // Page height can change (web fonts arriving, content edits): re-align the 3D objects.
  const bodyObserver = new ResizeObserver(() => {
    layout();
    onScroll();
  });
  bodyObserver.observe(document.body);

  let disposed = false;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    ascii.drawGlyphs();
    layout();
    onScroll();
  });

  // ---------------- main loop ----------------
  let smoothProgress = 0;
  let prevProgress = 0;
  let speed = 0;
  let time = 0;
  let last = performance.now();
  let firstFrame = true;
  let rafId = 0;
  const lookTarget = new THREE.Vector3();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    // camera glides along the road as you scroll
    smoothProgress += (progress - smoothProgress) * (1 - Math.exp(-dt * 4));
    const z = camZ(smoothProgress);
    const x = roadX(z);
    const bob = Math.sin(time * 1.3) * 0.08;
    camera.position.set(x + pointer.x * 0.6, 2.5 + bob + pointer.y * 0.3, z);
    lookTarget.set(roadX(z - 14) + pointer.x * 1.5, 1.9 + pointer.y * 0.8, z - 14);
    camera.lookAt(lookTarget);
    camera.rotateZ((roadX(z - 8) - x) * -0.012);

    // speedometer from scroll velocity
    const v = (Math.abs(smoothProgress - prevProgress) * L) / Math.max(dt, 1e-3);
    prevProgress = smoothProgress;
    // ease slowly both ways so the needle winds up and coasts down like a real gauge
    const target = v * 9;
    const rate = target > speed ? 0.45 : 0.7;
    speed += (target - speed) * (1 - Math.exp(-dt * rate));
    onFrame?.({ speed, progress: smoothProgress });

    pieces.update(time, dt);

    // glitch: occasional random bursts, decaying quickly
    if (!reduceMotion) {
      nextRandomGlitch -= dt;
      if (nextRandomGlitch < 0) {
        kick(0.25);
        nextRandomGlitch = 7 + Math.random() * 7;
      }
    }
    glitch *= Math.exp(-dt * 4.5);

    const u = ascii.uniforms;
    u.uGlitch.value = glitch;
    u.uTime.value = time;
    u.uDark.value += (darkTarget - u.uDark.value) * (1 - Math.exp(-dt * 5));

    ascii.render(renderer, scene, camera);

    if (firstFrame) {
      firstFrame = false;
      onReady?.();
    }
    rafId = requestAnimationFrame(frame);
  }

  resize();
  onScroll();
  rafId = requestAnimationFrame(frame);

  // ---------------- cleanup ----------------
  function dispose() {
    disposed = true;
    cancelAnimationFrame(rafId);
    removeEventListener('pointermove', onPointerMove);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onResize);
    bodyObserver.disconnect();

    scene.traverse((obj) => {
      obj.geometry?.dispose();
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      materials.forEach((m) => {
        m?.map?.dispose();
        m?.dispose();
      });
    });
    ascii.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  return { kick, setDark, layout, dispose };
}
