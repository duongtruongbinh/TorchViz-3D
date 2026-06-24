import { getStrings } from '../../../lib/localization';
import { useStore } from '../../../store/useStore';

type TheorySectionProps = {
  items: string[];
};

export default function TheorySection({ items }: TheorySectionProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <h3 className="text-xs font-black uppercase text-zinc-400">{t.theory}</h3>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-zinc-200">{item}</p>
        ))}
      </div>
    </section>
  );
}
