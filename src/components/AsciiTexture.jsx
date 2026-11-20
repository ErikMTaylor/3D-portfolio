import { useMemo } from 'react';

const CHARS = ' .:-=+*#';

/** Decorative wavy ASCII pattern used as a placeholder behind the project label. */
function buildPattern(cols = 120, rows = 34) {
  let out = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = Math.sin(x * 0.11 + y * 0.07) * Math.cos(y * 0.19 - x * 0.03) * 0.5 + 0.5;
      out += CHARS[Math.floor(v * (CHARS.length - 1))];
    }
    out += '\n';
  }
  return out;
}

export default function AsciiTexture() {
  const pattern = useMemo(buildPattern, []);
  return <pre aria-hidden="true">{pattern}</pre>;
}
