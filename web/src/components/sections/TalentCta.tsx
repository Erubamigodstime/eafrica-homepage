import { talentCta } from '@/lib/content';
import { Button } from '@/components/ui/primitives';
import Mascot from '@/components/ui/Mascot';
import './TalentCta.css';

/** Dark CTA with the mascot peeking up from the bottom edge (rises a little on hover, bobs idly). */
export default function TalentCta({ data = talentCta }: { data?: typeof talentCta }) {
  return (
    <section className="dark pp-tease" id="talent" aria-labelledby="ppTeaseH">
      <div className="w">
        <p className="pp-eb">{data.eyebrow}</p>
        <h2 id="ppTeaseH">{data.title}</h2>
        <p className="pp-lede">{data.lede}</p>
        <p className="pp-script">{data.script}</p>
        <Button href={data.cta.href}>{data.cta.label}</Button>
      </div>
      <div className="pp-up" aria-hidden="true"><Mascot className="pp-f" title="" /></div>
    </section>
  );
}
