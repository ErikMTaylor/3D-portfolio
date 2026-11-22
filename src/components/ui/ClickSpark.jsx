import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/env';

/**
 * Click spark effect: a burst of short lines radiating from every click.
 * Dependency-free take on reactbits.dev/animations/click-spark.
 *
 * One fixed, click-through canvas covers the viewport; the loop only runs while sparks are alive.
 * `color` may be any CSS color or a `var(--name)`, resolved at click time so it follows the theme.
 */
export default function ClickSpark({
  color = 'var(--accent2)',
  size = 12,
  radius = 22,
  count = 8,
  duration = 450,
  lineWidth = 2,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resolveColor = () => {
      const m = /^var\((--[^),\s]+)\)$/.exec(color);
      return m ? getComputedStyle(document.body).getPropertyValue(m[1]).trim() || '#fff' : color;
    };

    const easeOut = (t) => t * (2 - t);

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      sparks = sparks.filter((s) => now - s.start < duration);

      for (const s of sparks) {
        const p = easeOut((now - s.start) / duration);
        const dist = p * radius;
        const len = size * (1 - p);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x + dist * Math.cos(s.angle), s.y + dist * Math.sin(s.angle));
        ctx.lineTo(s.x + (dist + len) * Math.cos(s.angle), s.y + (dist + len) * Math.sin(s.angle));
        ctx.stroke();
      }

      raf = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onClick = (e) => {
      if (prefersReducedMotion()) return;
      const start = performance.now();
      const c = resolveColor();
      for (let i = 0; i < count; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / count, start, color: c });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
    };
  }, [color, size, radius, count, duration, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}
