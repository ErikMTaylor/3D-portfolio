import { retriggerGlitch } from '../../lib/glitch';

/**
 * Text with the RGB-split glitch effect. The effect plays when the section scrolls into
 * focus (see App.jsx), and also on hover if you pass `onHover`.
 *
 *   <Glitch as="h2">Builds</Glitch>
 *   <Glitch as="h1" onHover={() => doSomething()}>Your Name</Glitch>
 */
export default function Glitch({ as: Tag = 'h2', children, onHover, ...rest }) {
  const handleEnter = onHover
    ? (e) => {
        retriggerGlitch(e.currentTarget);
        onHover();
      }
    : undefined;

  return (
    <Tag className="glitch" data-text={children} onMouseEnter={handleEnter} {...rest}>
      {children}
    </Tag>
  );
}
