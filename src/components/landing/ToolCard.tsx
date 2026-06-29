import { ArrowRight } from 'lucide-react';

type ToolCardProps = {
  title: string;
  description: string;
  openLabel: string;
  onOpen: () => void;
};

export default function ToolCard({ title, description, openLabel, onOpen }: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid min-h-[148px] w-full grid-rows-[auto_1fr_auto] rounded-lg border border-cyan-200/35 bg-white/[0.055] p-4 text-left shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:border-cyan-100/70 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-cyan-300/45"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-6 text-white">{title}</h2>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
      <div className="flex justify-end pt-4">
        <span className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-md border border-cyan-100/45 bg-cyan-300/15 px-4 text-sm font-bold text-cyan-50 shadow-[0_10px_24px_rgba(8,145,178,0.18)] transition-all group-hover:border-cyan-50/80 group-hover:bg-cyan-300/22">
          <span className="whitespace-nowrap">{openLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
