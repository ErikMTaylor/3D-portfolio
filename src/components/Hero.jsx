import { hero, site } from '../content';
import { useSite } from '../context/SiteContext';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './Hero.css';

export default function Hero() {
  const { kick } = useSite();

  return (
    <section className="hero" id="start">
      <Reveal className="panel">
        <Glitch as="h1" onHover={() => kick(0.5)}>
          {site.name}
        </Glitch>
        <div className="roles">
          {hero.roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
        <div className="lede dim">
          {hero.lede.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="actions">
          <a className="btn" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <a className="btn ghost" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
