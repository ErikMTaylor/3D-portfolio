import { projects } from '../content';
import { useSite } from '../context/SiteContext';
import AsciiTexture from './AsciiTexture';
import Chips from './ui/Chips';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './Projects.css';

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

      <div className="grid">
        <Reveal as="article" className="card panel feature" onMouseEnter={onCardHover}>
          <div className="media">
            <AsciiTexture />
            <span className="label">{featured.mediaLabel}</span>
          </div>
          <div className="body">
            <Chips items={featured.tags} />
            <h3>{featured.title}</h3>
            <p className="dim">{featured.text}</p>
            <div className="meta">
              {featured.meta.map((m) => (
                <div key={m.label}>
                  <small>{m.label}</small>
                  <span>{m.value}</span>
                </div>
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

        <div className="side">
          {upcoming.map((item) => (
            <Reveal key={item.slot} className="card panel locked" onMouseEnter={onCardHover}>
              <div className="lk">
                <span>{item.slot}</span>
                <span>{item.status}</span>
              </div>
              <div>
                <h4>{item.title}</h4>
                <p className="dim">{item.text}</p>
              </div>
              <div className="bar">
                <i style={{ width: `${item.progress}%` }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
