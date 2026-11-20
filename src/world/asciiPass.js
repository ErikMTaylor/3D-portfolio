import * as THREE from 'three';
import vertexShader from './shaders/ascii.vert.glsl?raw';
import fragmentShader from './shaders/ascii.frag.glsl?raw';

/** Characters from darkest to brightest. Add or reorder to change the look. */
const CHARS = ' .:-~=+*x%#@';
const GLYPH_W = 32;
const GLYPH_H = 52;

/**
 * Post-processing pass: the 3D scene is rendered to a small texture, then a full-screen
 * quad re-draws it as ASCII using a texture atlas of the characters above.
 */
export function createAsciiPass({ mobile, dpr, dark }) {
  // --- glyph atlas -------------------------------------------------------
  const glyphCanvas = document.createElement('canvas');
  glyphCanvas.width = GLYPH_W * CHARS.length;
  glyphCanvas.height = GLYPH_H;
  const glyphTexture = new THREE.CanvasTexture(glyphCanvas);
  glyphTexture.minFilter = THREE.LinearFilter;
  glyphTexture.generateMipmaps = false;

  function drawGlyphs() {
    const g = glyphCanvas.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, glyphCanvas.width, GLYPH_H);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '600 44px "IBM Plex Mono", ui-monospace, monospace';
    [...CHARS].forEach((ch, i) => g.fillText(ch, i * GLYPH_W + GLYPH_W / 2, GLYPH_H / 2 + 2));
    glyphTexture.needsUpdate = true;
  }
  drawGlyphs();

  // --- shader ------------------------------------------------------------
  const cellSize = mobile ? new THREE.Vector2(7, 11) : new THREE.Vector2(8, 13); // px per character

  const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: renderTarget.texture },
      tGlyph: { value: glyphTexture },
      uRes: { value: new THREE.Vector2() },
      uCell: { value: cellSize.multiplyScalar(dpr) },
      uN: { value: CHARS.length },
      uTime: { value: 0 },
      uGlitch: { value: 0 },
      uDark: { value: dark ? 1 : 0 },
      uBgL: { value: new THREE.Color('#fbf6ff') }, // keep in sync with --bg in styles/base.css
      uBgD: { value: new THREE.Color('#0c0a14') },
      uInk: { value: new THREE.Color('#241b35') },
    },
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
  });

  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quadScene.add(quad);

  return {
    uniforms: material.uniforms,
    drawGlyphs,

    setSize(width, height) {
      renderTarget.setSize(Math.ceil((width * dpr) / 2), Math.ceil((height * dpr) / 2));
      material.uniforms.uRes.value.set(width * dpr, height * dpr);
    },

    render(renderer, scene, camera) {
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCamera);
    },

    dispose() {
      renderTarget.dispose();
      glyphTexture.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
