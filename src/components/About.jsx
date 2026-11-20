import { about } from '../content';
import Chips from './ui/Chips';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './About.css';

export default function About() {
  return (
    <section className="about" id="about">
      <Reveal className="panel">
        <span className="kicker">{about.kicker}</span>
        <Glitch>{about.title}</Glitch>
        <p className="dim">{about.text}</p>

        <div className="loadout">
          {about.loadout.map((slot) => (
            <div className="slot" key={slot.label}>
              <pre>{slot.icon}</pre>
              <div>
                <small>{slot.label}</small>
                <span>{slot.value}</span>
              </div>
            </div>
          ))}
        </div>

        <Chips items={about.skills} />
      </Reveal>
    </section>
  );
}
