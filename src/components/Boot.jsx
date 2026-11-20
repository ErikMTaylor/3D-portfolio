import './Boot.css';

/** Full-screen loading text that fades out once the first 3D frame is drawn. */
export default function Boot({ done }) {
  return (
    <div id="boot" className={done ? 'gone' : ''}>
      <pre>{'> loading world\n> compiling shaders\n> rendering as ascii_'}</pre>
    </div>
  );
}
