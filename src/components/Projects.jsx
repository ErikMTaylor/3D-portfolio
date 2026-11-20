import { projects } from '../content';
import { useSite } from '../context/SiteContext';
import AsciiTexture from './AsciiTexture';
import Chips from './ui/Chips';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './Projects.css';

/**
 * Header panel (same style as the other sections), then a wide centred featured card
 * (image left, details right) and a strip of what's coming next.
 */
export default function Projects() {
  const { kick } = useSite();
  const onCardHover = () => kick(0.35);
  const { featured, upcoming } = projects;

  return (
    <section className="projects" id="projects">
      <div className="head">
        <Reveal className="panel">
          <span className="kicker">{projects.kicker}</span>
          <Glitch>{projects.title}</Glitch>
        </Reveal>
      </div>

      <Reveal as="article" className="panel feature" onMouseEnter={onCardHover}>
        <div className="media">
          <AsciiTexture />
          <span className="label">{featured.mediaLabel}</span>
        </div>
        <div className="info">
          <h3>{featured.title}</h3>
          <Chips items={featured.stack} />
          <div className="desc">
            {featured.text.map((line) => (
              <p className="dim" key={line}>
                {line}
              </p>
            ))}
          </div>
          <div className="links">
            {featured.links.map((link, i) => (
              <a
                key={link.label}
                className={i === 0 ? 'btn' : 'btn ghost'}
                href={link.href}
                target="_blank"
                rel="noopener"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="panel upnext" onMouseEnter={onCardHover}>
        {upcoming.map((item) => (
          <div className="upnext-item" key={item.slot}>
            <div className="lk">
              <span>{item.slot}</span>
              <span>{item.status}</span>
            </div>
            <h4>{item.title}</h4>
            <p className="dim">{item.text}</p>
            <div className="bar">
              <i style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
