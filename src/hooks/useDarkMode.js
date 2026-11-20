import { useCallback, useEffect, useState } from 'react';

/**
 * Day / night toggle. Adds `dark` to <body> (see styles/base.css).
 * Every visit starts in dark mode; it only changes when the visitor clicks the toggle.
 */
export function useDarkMode() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return [dark, toggle];
}
