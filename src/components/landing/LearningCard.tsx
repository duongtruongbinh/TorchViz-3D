import { ArrowRight } from 'lucide-react';

type LearningCardProps = {
  title: string;
  description: string;
  openLabel: string;
  onOpen: () => void;
};

export default function LearningCard({ title, description, openLabel, onOpen }: LearningCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid min-h-[148px] w-full grid-rows-[auto_1fr_auto] rounded-lg border border-emerald-200/30 bg-emerald-300/[0.055] p-4 text-left shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-emerald-100/65 hover:bg-emerald-300/[0.075] focus:outline-none focus:ring-2 focus:ring-emerald-300/45"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-6 text-zinc-100">{title}</h2>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
      <div className="flex justify-end pt-4">
        <span className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-md border border-emerald-100/40 bg-emerald-300/15 px-4 text-sm font-bold text-emerald-50 shadow-[0_10px_24px_rgba(16,185,129,0.13)] transition-all group-hover:border-emerald-50/75 group-hover:bg-emerald-300/20">
          <span className="whitespace-nowrap">{openLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
