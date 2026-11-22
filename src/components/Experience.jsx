import { experience } from '../content';
import Chips from './ui/Chips';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './Experience.css';


/**
 * One full-height "checkpoint" per role. The `data-cp` attribute is how the 3D world
 * finds each one to place a gate on the road next to it.
 */
function Checkpoint({ number, side, children }) {
  return (
    <div className={`cp cp--${side}`} data-cp>
      <Reveal className="panel">
        <div className="row">
          <span className="flag">checkpoint {number}</span>
        </div>
        {children}
      </Reveal>
    </div>
  );
}

export default function Experience() {
  const { roles, next } = experience;
  const sideOf = (i) => (i % 2 === 0 ? 'left' : 'right');

  return (
    <section className="work" id="work">
      <div className="intro">
        <Reveal className="panel">
          <span className="kicker">{experience.kicker}</span>
          <Glitch>{experience.title}</Glitch>
        </Reveal>
      </div>

      {roles.map((role, i) => (
        <Checkpoint key={role.title + role.company} number={i + 1} side={sideOf(i)}>
          <h3>{role.title}</h3>
          <div className="co">
            @ {role.company} · {role.period}
          </div>
          <ul>
            {role.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Chips items={role.tech} />
        </Checkpoint>
      ))}

      <Checkpoint number={roles.length + 1} side={sideOf(roles.length)}>
        <h3>{next.title}</h3>
        <p className="dim next-text">{next.text}</p>
        <div className="next-cta">
          <a className="btn" href={next.cta.href}>
            {next.cta.label}
          </a>
        </div>
      </Checkpoint>
    </section>
  );
}
