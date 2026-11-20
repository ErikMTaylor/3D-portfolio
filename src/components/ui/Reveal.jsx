import { useEffect, useRef, useState } from 'react';

/** Fades and slides its children in the first time they scroll into view. */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${shown ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
