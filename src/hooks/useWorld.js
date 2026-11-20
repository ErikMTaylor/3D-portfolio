import { useCallback, useEffect, useRef, useState } from 'react';
import { createWorld } from '../world/createWorld';

// DOM elements the 3D scene lines itself up with.
const getLayoutTargets = () => ({
  about: document.getElementById('about'),
  projects: document.getElementById('projects'),
  checkpoints: [...document.querySelectorAll('[data-cp]')],
});

/**
 * Starts the Three.js world inside `mountRef` and keeps it in sync with React state.
 *
 * @returns {{ status: 'loading'|'ready'|'failed', kick: (amount:number) => void }}
 *   `kick` makes the ASCII glitch for a moment (0 – 1).
 */
export function useWorld({ mountRef, dark, checkpointCount, onFrame }) {
  const worldRef = useRef(null);
  const [status, setStatus] = useState('loading');

  // Latest values, readable from inside the long-lived world without restarting it.
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    const world = createWorld({
      container: mountRef.current,
      checkpointCount,
      initialDark: darkRef.current,
      getLayoutTargets,
      onFrame: (state) => onFrameRef.current?.(state),
      onReady: () => setStatus('ready'),
      onFail: () => setStatus('failed'),
    });
    worldRef.current = world;
    return () => {
      world.dispose();
      worldRef.current = null;
    };
  }, [mountRef, checkpointCount]);

  useEffect(() => {
    worldRef.current?.setDark(dark);
  }, [dark]);

  const kick = useCallback((amount) => worldRef.current?.kick(amount), []);

  return { status, kick };
}
