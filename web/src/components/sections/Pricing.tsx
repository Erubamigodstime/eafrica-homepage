import { Fragment } from 'react';
import { pricing } from '@/lib/content';
import './Pricing.css';

/** Three cards joined by operators (the last is the dark highlighted card). */
export default function Pricing({ data = pricing }: { data?: typeof pricing }) {
  return (
    <section className="sec" id="pricing">
      <div className="w">
        <div className="hd c prc">
          <p className="kick eb">{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p className="big sp">{data.sub.map((l, i) => <Fragment key={l}>{i > 0 && ' '}<span className="l1">{l}</span></Fragment>)}</p>
        </div>
        <div className="peq">
          {data.plans.map((p, i) => (
            <Fragment key={p.label}>
              {i > 0 && <span className={`pop${/[a-z]/i.test(data.operator) ? ' word' : ''}`} aria-hidden="true">{data.operator}</span>}
              <article className={`pq ${p.dark ? 'dk' : ''}`}>
                <p className="lab">{p.label}</p>
                <h3>{p.price}</h3>
                <p>{p.body}</p>
              </article>
            </Fragment>
          ))}
        </div>
        <div className="prange">
          <p className="pr1">{data.rangeTitle}</p>
          <p className="pr2">{data.rangeNote} <a href={data.rangeLink.href}><span className="mt">{data.rangeLink.label}</span> <span className="ma" aria-hidden="true">›</span></a></p>
        </div>
      </div>
    </section>
  );
}
