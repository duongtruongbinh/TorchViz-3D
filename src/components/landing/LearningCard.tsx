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
      className="group grid min-h-[124px] w-full grid-rows-[auto_auto_auto] rounded-lg border border-teal-300/35 bg-teal-500/10 p-3 text-left shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:border-teal-200/75 hover:bg-teal-500/15 focus:outline-none focus:ring-2 focus:ring-teal-300/45"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold leading-5 text-zinc-100">{title}</h2>
        </div>
      </div>
      <p className="mt-1.5 text-xs leading-[1.45] text-zinc-400">{description}</p>
      <div className="flex justify-end pt-2">
        <span className="inline-flex h-8 min-w-40 items-center justify-center gap-2 rounded-md border border-teal-200/45 bg-teal-400/15 px-3 text-[13px] font-bold text-teal-50 shadow-[0_0_18px_rgba(45,212,191,0.18)] transition-all group-hover:border-teal-100/80 group-hover:bg-teal-400/25">
          <span className="whitespace-nowrap">{openLabel}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">-&gt;</span>
        </span>
      </div>
    </button>
  );
}
