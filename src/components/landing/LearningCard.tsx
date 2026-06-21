type LearningCardProps = {
  title: string;
  description: string;
  statusLabel: string;
};

export default function LearningCard({ title, description, statusLabel }: LearningCardProps) {
  return (
    <div
      aria-disabled="true"
      className="flex h-full min-h-[0] w-full flex-col rounded-lg border border-zinc-700/70 bg-zinc-950/45 p-3.5 text-left opacity-75 shadow-xl shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase text-teal-200/80">{statusLabel}</div>
          <h2 className="mt-1.5 text-base font-bold leading-5 text-zinc-100">{title}</h2>
        </div>
        <span
          aria-hidden="true"
          className="flex min-h-7 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-2 text-[9px] font-bold uppercase leading-4 text-zinc-400"
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-400">{description}</p>
    </div>
  );
}
