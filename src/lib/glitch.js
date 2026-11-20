import { prefersReducedMotion } from './env';

/** Replays the CSS glitch animation on an element that has the `glitch` class. */
export function retriggerGlitch(el) {
  if (!el || prefersReducedMotion()) return;
  el.classList.remove('on');
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add('on');
}
