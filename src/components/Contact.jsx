import { contact, site } from '../content';
import { useSite } from '../context/SiteContext';
import Cat from './Cat';
import Glitch from './ui/Glitch';
import Reveal from './ui/Reveal';
import './Contact.css';

export default function Contact() {
  const { toast } = useSite();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast('email copied');
    } catch {
      toast('copy blocked: ' + contact.email);
    }
  };

  return (
    <section className="contact" id="contact">
      <Reveal className="term panel">
        <Cat />
        <div className="bar3">
          <i />
          <i />
          <i />
          <span>{contact.terminalTitle}</span>
        </div>

        <div className="out">
          <div>
            <span className="pr">$</span> ./contact --list
          </div>
          <Glitch>{contact.title}</Glitch>
          <p className="dim">{contact.text}</p>

          <div className="rows">
            <div>
              <span className="k">email</span>
              <span>{contact.email}</span>
              <button className="copy" onClick={copyEmail}>
                copy
              </button>
            </div>
            {contact.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener">
                <span className="k">{link.label}</span>
                <span>{link.text}</span>
                <span>↗</span>
              </a>
            ))}
          </div>

          <div>
            <span className="pr">$</span> <span className="cursor prompt-cursor" />
          </div>
        </div>
      </Reveal>

      <footer>
        © {site.year} {site.name} · {site.footer}
      </footer>
    </section>
  );
}
