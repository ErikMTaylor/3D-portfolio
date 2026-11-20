import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pf-dark';

const readSaved = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/** Day / night toggle. Adds `dark` to <body> (see styles/base.css) and remembers the choice. */
export function useDarkMode() {
  const [dark, setDark] = useState(readSaved);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((d) => {
      try {
        localStorage.setItem(STORAGE_KEY, d ? '0' : '1');
      } catch {
        /* storage unavailable: just don't remember */
      }
      return !d;
    });
  }, []);

  return [dark, toggle];
}
