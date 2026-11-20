import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/**
 * Two things almost any component may want:
 *   toast(message)  → show the little pill at the top
 *   kick(amount)    → glitch the ASCII background for a moment
 */
const SiteContext = createContext({ toast: () => {}, kick: () => {} });

export const useSite = () => useContext(SiteContext);

export function SiteProvider({ kick, children }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef(0);

  const toast = useCallback((text) => {
    setMessage(text);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 1600);
  }, []);

  const value = useMemo(() => ({ toast, kick }), [toast, kick]);

  return (
    <SiteContext.Provider value={value}>
      {children}
      <div id="toast" className={visible ? 'show' : ''} role="status">
        {message}
      </div>
    </SiteContext.Provider>
  );
}
