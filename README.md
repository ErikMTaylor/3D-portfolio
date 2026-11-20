# ASCII 3D Portfolio

A scroll-driven 3D road rendered as ASCII by a fragment shader, with portfolio content on top.
Built with React + Vite + Three.js.

The 3D scene is plain Three.js in `src/world`. React starts it once (`useWorld`) and talks to it through a small handle
(`kick`, `setDark`), so scene can be edited without touching any React code.
