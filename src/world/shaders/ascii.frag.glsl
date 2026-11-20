// Turns the rendered 3D scene into ASCII: each screen cell samples the scene,
// picks a character by brightness from the glyph atlas, and tints it.

uniform sampler2D tScene, tGlyph;
uniform vec2 uRes, uCell;
uniform float uN, uTime, uGlitch, uDark;
uniform vec3 uBgL, uBgD, uInk;
varying vec2 vUv;

float hash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
  vec2 px = vUv * uRes;
  float tt = floor(uTime * 24.0);

  // glitch: horizontal band shifts
  float band = floor(px.y / (uCell.y * 2.0));
  if (hash(band * 7.13 + tt) < uGlitch * 0.35) px.x += (hash(band + tt * 1.7) - 0.5) * uGlitch * uRes.x * 0.14;

  // sample the scene once per cell (with RGB split during a glitch)
  vec2 cell = floor(px / uCell);
  vec2 uvc = (cell + 0.5) * uCell / uRes;
  float sp = uGlitch * 0.012;
  vec3 c = vec3(texture2D(tScene, uvc + vec2(sp, 0.0)).r, texture2D(tScene, uvc).g, texture2D(tScene, uvc - vec2(sp, 0.0)).b);
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));

  // brightness picks the character
  float lum = dot(c, vec3(0.3, 0.59, 0.11));
  float idx = clamp(floor(pow(lum, 0.85) * uN), 0.0, uN - 1.0);
  vec2 f = fract(px / uCell);
  float g = texture2D(tGlyph, vec2((idx + f.x) / uN, f.y)).r;

  // colour
  float mx = max(max(c.r, c.g), c.b);
  float mn = min(min(c.r, c.g), c.b);
  vec3 hue = c / max(mx, 0.001);
  vec3 sat = clamp((c - mn) / max(mx - mn, 0.001), 0.0, 1.0);
  vec3 vivid = mix(vec3(1.0), sat, 0.85);

  // light theme
  vec3 glyphL = mix(vivid * vec3(0.86, 0.5, 0.84), uInk, 0.18);
  glyphL = mix(glyphL, uInk, smoothstep(0.75, 1.0, lum) * 0.5);
  vec3 bgL = mix(uBgL, hue, lum * 0.10);

  // dark theme
  vec3 glyphD = mix(mix(vec3(1.0), sat, 0.55), vec3(1.0), 0.1);
  vec3 bgD = uBgD + hue * lum * 0.07;

  vec3 col = mix(mix(bgL, glyphL, g), mix(bgD, glyphD, g), uDark);

  gl_FragColor = vec4(col, 1.0);
}
