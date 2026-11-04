import { partners } from '@/lib/content';
import './LogoStrip.css';

/** Partner logo wall: flex rows that idle-float with phase offsets; colour returns on hover. Collapses to a grid on phones. */
export default function LogoStrip({ data = partners }: { data?: typeof partners }) {
  return (
    <div className="logos2">
      <p>{data.title}</p>
      {data.rows.map((row, r) => (
        <ul key={r} className="lrow" role="list">
          {row.map(([file, name]) => (
            <li key={name}>
              <span className="lg" role="img" aria-label={name}>
                {file ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/partners/${file}.png`} alt="" />
                ) : (
                  <span className="lg-txt" aria-hidden="true">{name[0]}</span>
                )}
                <span aria-hidden="true">{name}</span>
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
