'use client';
import { problem } from '@/lib/content';
import { useInView } from '@/lib/motion';
import './Problem.css';

function ProblemRow({ title, body, answer }: { title: string; body: string; answer: string }) {
  const [ref, inView] = useInView<HTMLLIElement>({ threshold: 0.3 });
  return (
    <li ref={ref} className={`rv-l ${inView ? 'in' : ''}`}>
      <div><h3>{title}</h3><p>{body}</p></div>
      <span className="ans">
        <svg className="ck" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" /><path d="M7 12.5l3.2 3.2L17 9" /></svg>
        {answer}
      </span>
    </li>
  );
}

/** Dark section: problem rows slide up, answers slide in from the right, checks pop and draw. */
export default function Problem({ data = problem }: { data?: typeof problem }) {
  return (
    <section className="dark problem" id="about">
      <div className="w">
        <p className="kick eb">{data.eyebrow}</p>
        <h2 className="xl">{data.title}</h2>
        <ol className="pl">{data.rows.map((r) => <ProblemRow key={r.title} {...r} />)}</ol>
      </div>
    </section>
  );
}
