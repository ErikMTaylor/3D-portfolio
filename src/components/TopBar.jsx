import { nav, site } from '../content';
import './TopBar.css';

/** Fixed header: brand on the left, section links + day/night switch on the right. */
export default function TopBar({ activeId, dark, onToggleDark }) {
  return (
    <header className="top">
      <a className="brand" href="#start">
        {site.handle}
        <span className="cursor" />
      </a>
      <nav className="links" aria-label="Sections">
        {nav.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[item.hideOnSmall && 'hide-sm', activeId === item.id && 'on'].filter(Boolean).join(' ')}
          >
            {item.label}
          </a>
        ))}
        <button id="lights" aria-pressed={dark} title="Switch between day and night" onClick={onToggleDark}>
          {dark ? 'day' : 'night'}
        </button>
      </nav>
    </header>
  );
}
