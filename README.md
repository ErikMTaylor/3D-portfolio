# ASCII 3D Portfolio

A scroll-driven 3D road rendered as ASCII by a fragment shader, with portfolio content on top.
Built with React + Vite + Three.js.

## Project layout

```
src/
  content.js          all the text and links
  App.jsx             page shell: wires the 3D world, theme and sections together
  components/         one file (+ css) per section: Hero, About, Projects, Experience, Contact
    ui/               tiny reusable pieces: Reveal, Glitch, Chips
  hooks/              useWorld (starts Three.js), useDarkMode, useCurrentSection
  context/            toast + glitch helpers available to any component (useSite)
  world/              plain Three.js: scene, road, terrain, set pieces, ASCII shader
  styles/base.css     theme tokens and shared styles
```

The 3D scene is plain Three.js in `src/world`. React starts it once (`useWorld`) and talks to it through a small handle
(`kick`, `setDark`), so scene can be edited without touching any React code.
