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
      className="group grid min-h-[124px] w-full grid-rows-[auto_auto_auto] rounded-lg border border-blue-300/45 bg-blue-500/10 p-3 text-left shadow-2xl shadow-black/35 transition-all hover:-translate-y-0.5 hover:border-blue-200/80 hover:bg-blue-500/15 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold leading-5 text-white">{title}</h2>
        </div>
      </div>
      <p className="mt-1.5 text-xs leading-[1.45] text-zinc-300">{description}</p>
      <div className="flex justify-end pt-2">
        <span className="inline-flex h-8 min-w-40 items-center justify-center gap-2 rounded-md border border-blue-200/45 bg-blue-400/20 px-3 text-[13px] font-bold text-blue-50 shadow-[0_0_18px_rgba(96,165,250,0.22)] transition-all group-hover:border-blue-100/80 group-hover:bg-blue-400/30 group-hover:shadow-[0_0_24px_rgba(96,165,250,0.35)]">
          <span className="whitespace-nowrap">{openLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
