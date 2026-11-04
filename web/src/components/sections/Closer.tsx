import { closer } from '@/lib/content';
import { Button } from '@/components/ui/primitives';
import './Closer.css';

export default function Closer({ data = closer }: { data?: typeof closer }) {
  return (
    <section className="closer" id="contact">
      <div className="w">
        <h2 className="xl">{data.title}</h2>
        <p className="big">{data.body}</p>
        <div className="ctas">
          <Button href={data.primary.href}>{data.primary.label}</Button>
          <Button href={data.secondary.href} variant="ghost">{data.secondary.label}</Button>
        </div>
        <p className="fine">{data.fine}</p>
      </div>
    </section>
  );
}
