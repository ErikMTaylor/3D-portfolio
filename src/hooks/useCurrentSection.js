import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which <main> section is under the middle of the screen.
 * Returns its id, and calls `onChange(id, element)` whenever it changes.
 */
export function useCurrentSection(onChange) {
  const [current, setCurrent] = useState('start');
  const currentRef = useRef('start');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section[id]')];

    const check = () => {
      const mid = innerHeight * 0.5;
      const active = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      if (active && active.id !== currentRef.current) {
        currentRef.current = active.id;
        setCurrent(active.id);
        onChangeRef.current?.(active.id, active);
      }
    };

    addEventListener('scroll', check, { passive: true });
    check();
    return () => removeEventListener('scroll', check);
  }, []);

  return current;
}
