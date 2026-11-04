import { faq } from '@/lib/content';
import './Faq.css';

/** Native <details> accordion (opens instantly, like the reference); the + morphs into − on open. */
export default function Faq({ data = faq }: { data?: typeof faq }) {
  return (
    <section className="sec alt" id="faq">
      <div className="w narrow">
        <h2 className="c" id="faqs">{data.title}</h2>
        <div className="faq">
          {data.items.map(([q, a]) => (
            <details key={q}>
              <summary>{q}<span className="pm" aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
