import { forwardRef, useImperativeHandle, useRef } from 'react';
import './Hud.css';

/**
 * Bottom-left speedometer + progress bar.
 * The 3D world updates it every frame through the ref (`hud.update({ speed, progress })`),
 * which writes straight to the DOM so React doesn't re-render 60 times a second.
 */
const Hud = forwardRef(function Hud({ stageLabel }, ref) {
  const speedEl = useRef(null);
  const trackEl = useRef(null);

  useImperativeHandle(ref, () => ({
    update({ speed, progress }) {
      if (speedEl.current) speedEl.current.textContent = String(Math.min(Math.round(speed), 299)).padStart(3, '0');
      if (trackEl.current) trackEl.current.style.transform = `scaleX(${progress})`;
    },
  }));

  return (
    <div className="hud" aria-hidden="true">
      <div className="spd">
        <b ref={speedEl}>000</b> mph
      </div>
      <div className="stage">
        <span>{stageLabel}</span>
        <div className="track">
          <i ref={trackEl} />
        </div>
      </div>
    </div>
  );
});

export default Hud;
