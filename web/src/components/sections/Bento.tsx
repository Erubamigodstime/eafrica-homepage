'use client';
import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { standard } from '@/lib/content';
import { useInView } from '@/lib/motion';
import './Bento.css';

/** Renders `\n` in a title as a <br>, like the reference card titles. */
const Lines = ({ text }: { text: string }) => (
  <>{text.split('\n').map((l, i) => <Fragment key={l}>{i > 0 && <br />}{l}</Fragment>)}</>
);

/**
 * Card shell. Mirrors the reference scroll reveal: `.reveal` + a transition-delay of
 * min(siblingIndex, 5) * 70ms, `.vis` once 12% is visible (40px bottom inset). Widgets animate off `.vis`.
 */
export function BentoCard({ span, index = 0, className = '', children }: { span: 2 | 4 | 6; index?: number; className?: string; children: ReactNode }) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  return (
    <article ref={ref} className={`b b${span} ${className} reveal ${inView ? 'vis' : ''}`} style={{ transitionDelay: `${Math.min(index, 5) * 70}ms` }}>
      {children}
    </article>
  );
}

const CardText = ({ title, body, children }: { title: string; body: string; children?: ReactNode }) => (
  <div className="bt"><h3><Lines text={title} /></h3><p>{body}</p>{children}</div>
);

/* ---------- Widgets ---------- */
export function RoleBlueprint({ data = standard.blueprint }) {
  return (
    <div className="opm" aria-label="Example role blueprint">
      <div className="opm-h">
        <span className="opm-who">
          <i className="me">You</i>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <i className="them"><img src={data.photo} alt="" /></i>
        </span>
        <span className="opm-t"><b>{data.head}</b><em>{data.sub}</em></span>
        <span className="gm"><i />{data.badge}</span>
      </div>
      <ul className="axes">
        {data.axes.map((a) => {
          const lo = Math.min(a.you, a.hire), hi = Math.max(a.you, a.hire);
          return (
            <li key={a.left}>
              <span>{a.left}</span>
              <span className="ax">
                <i className="m" style={{ ['--a' as string]: `${a.you}%` }} />
                <i className="t" style={{ ['--a' as string]: `${a.hire}%` }} />
                <s className={a.shared ? 'sh' : undefined} style={{ ['--l' as string]: `${lo}%`, ['--r' as string]: `${100 - hi}%` }} />
              </span>
              <span>{a.right}</span>
            </li>
          );
        })}
      </ul>
      <p className="opm-k">
        <span><i className="k m" />{data.key.you}</span>
        <span><i className="k t" />{data.key.hire}</span>
        <span className="fill">{data.key.fill}</span>
        <span className="share">{data.key.share}</span>
      </p>
    </div>
  );
}

export function LiveClocks({ cities = standard.clocks.cities }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="wclock">
      <p className="live"><i />Live now</p>
      <ul>
        {cities.map((c) => (
          <li key={c.tz}>
            <span className="cc">{c.cc}</span>
            <span className="cty">{c.city}</span>
            <b>{now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: c.tz }) : '--:--'}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LevelLadder({ levels = standard.ladder.levels, label = standard.ladder.key }) {
  return (
    <>
      <ol className="ladder" aria-label={label}>
        {levels.map(([l, on], i) => (
          <li key={l} className={`${on ? 'on' : 'off'}${on && i === levels.length - 1 ? ' hi' : ''}`}>{l}</li>
        ))}
      </ol>
      <p className="ladder-k"><i />{label}</p>
    </>
  );
}

const Tick = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4l2.8 2.8 6.2-6.6" /></svg>
);

export function Receipt({ head = standard.receipt.head, tag = standard.receipt.tag, items = standard.receipt.items }) {
  return (
    <div className="rcpt">
      <p className="rh"><span>{head}</span><em>{tag}</em></p>
      <ul>{items.map((t) => <li key={t}><Tick />{t}</li>)}</ul>
    </div>
  );
}

export function ScaleTimeline({ data = standard.scale }) {
  const nowX = data.marks[2][1];
  return (
    <div className="plan">
      <span className="nowpill" style={{ ['--x' as string]: `${nowX}%` }}>{data.now}</span>
      <div className="pt">
        <i className="pfill" />
        {data.marks.map(([label, x], i) => (
          <span key={x} className={`ms${i === 2 ? ' now' : ''}${x === 0 ? ' first' : x === 100 ? ' last' : ''}`} style={{ ['--x' as string]: `${x}%` }}>
            {label && <b>{label}</b>}
          </span>
        ))}
      </div>
      <p className="plan-k">{data.phases.map((p) => <span key={p}>{p}</span>)}</p>
    </div>
  );
}

export function RotatingSeal({ text = standard.guarantee.seal }) {
  return (
    <div className="seal" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs><path id="sealp" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
        <text textLength="286" lengthAdjust="spacing"><textPath href="#sealp" textLength="286" lengthAdjust="spacing">{text}</textPath></text>
      </svg>
      <span className="sc">
        <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeMiterlimit="2.6">
          <path d="M12 3.6 4.6 6.4V11c0 4.6 3.1 7.6 7.4 9 4.3-1.4 7.4-4.4 7.4-9V6.4Z" />
          <path d="M9 12l2.2 2.2L15 9" />
        </svg>
      </span>
    </div>
  );
}

/* ---------- Section ---------- */
export default function Bento({ data = standard }: { data?: typeof standard }) {
  return (
    <section className="sec" id="solutions">
      <div className="w">
        <div className="hd std">
          <p className="kick">{data.eyebrow}</p>
          <h2>{data.title.map((l, i) => <Fragment key={l}>{i > 0 && ' '}<span className="l1">{l}</span></Fragment>)}</h2>
          <p className="big sp">{data.sub}</p>
        </div>
        <div className="bento v2">
          <BentoCard span={4} index={0} className="lead">
            <CardText title={data.blueprint.title} body={data.blueprint.body} />
            <RoleBlueprint data={data.blueprint} />
          </BentoCard>
          <BentoCard span={2} index={1}>
            <CardText title={data.clocks.title} body={data.clocks.body} />
            <LiveClocks cities={data.clocks.cities} />
          </BentoCard>
          <BentoCard span={2} index={2}>
            <CardText title={data.ladder.title} body={data.ladder.body} />
            <LevelLadder levels={data.ladder.levels} label={data.ladder.key} />
          </BentoCard>
          <BentoCard span={2} index={3}>
            <CardText title={data.receipt.title} body={data.receipt.body} />
            <Receipt head={data.receipt.head} tag={data.receipt.tag} items={data.receipt.items} />
          </BentoCard>
          <BentoCard span={2} index={4}>
            <CardText title={data.scale.title} body={data.scale.body} />
            <ScaleTimeline data={data.scale} />
          </BentoCard>
          <BentoCard span={6} index={5} className="dark guar">
            <CardText title={data.guarantee.title} body={data.guarantee.body}>
              <div className="gchips">{data.guarantee.chips.map((t) => <span key={t}><i />{t}</span>)}</div>
            </CardText>
            <RotatingSeal text={data.guarantee.seal} />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
