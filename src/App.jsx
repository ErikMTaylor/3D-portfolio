import { useCallback, useEffect, useRef } from 'react';
import { experience, stageLabels } from './content';
import { SiteProvider } from './context/SiteContext';
import { useCurrentSection } from './hooks/useCurrentSection';
import { useDarkMode } from './hooks/useDarkMode';
import { useWorld } from './hooks/useWorld';
import { retriggerGlitch } from './lib/glitch';

import Boot from './components/Boot';
import TopBar from './components/TopBar';
import Hud from './components/Hud';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ClickSpark from './components/ui/ClickSpark';

// one gate per role, plus the finish line
const CHECKPOINT_COUNT = experience.roles.length + 1;

export default function App() {
  const worldMount = useRef(null);
  const hud = useRef(null);
  const [dark, toggleDark] = useDarkMode();

  const handleFrame = useCallback((state) => hud.current?.update(state), []);
  const { status, kick } = useWorld({
    mountRef: worldMount,
    dark,
    checkpointCount: CHECKPOINT_COUNT,
    onFrame: handleFrame,
  });

  // glitch the section heading (and the background) each time you scroll into a new section
  const section = useCurrentSection((id, el) => {
    retriggerGlitch(el.querySelector('h2.glitch'));
    kick(0.7);
  });

  // one big glitch on the hero name once the world has loaded
  useEffect(() => {
    if (status !== 'ready') return;
    const t = setTimeout(() => {
      retriggerGlitch(document.querySelector('#start .glitch'));
      kick(0.9);
    }, 350);
    return () => clearTimeout(t);
  }, [status, kick]);

  const onToggleDark = () => {
    toggleDark();
    kick(0.8);
  };

  return (
    <SiteProvider kick={kick}>
      <ClickSpark />
      <Boot done={status !== 'loading'} />
      <div className="world" ref={worldMount} aria-hidden="true" style={status === 'failed' ? { display: 'none' } : undefined} />

      <TopBar activeId={section} dark={dark} onToggleDark={onToggleDark} />
      <Hud ref={hud} stageLabel={stageLabels[section]} />

      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </SiteProvider>
  );
}
