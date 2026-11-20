/** A wrapping row of small pill tags. */
export default function Chips({ items, className = '' }) {
  return (
    <div className={`chips ${className}`.trim()}>
      {items.map((item) => (
        <span className="chip" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}
