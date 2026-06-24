import { getStrings } from '../../../lib/localization';
import { useStore } from '../../../store/useStore';

type HintSectionProps = {
  hints: string[];
};

export default function HintSection({ hints }: HintSectionProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  return (
    <section className="rounded-lg border border-amber-300/20 bg-amber-400/5 p-4">
      <h3 className="text-xs font-black uppercase text-amber-200">{t.hints}</h3>
      <ul className="mt-3 space-y-2">
        {hints.map((hint) => (
          <li key={hint} className="flex gap-2 text-sm leading-6 text-zinc-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>{hint}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
