type ToolCardProps = {
  title: string;
  description: string;
  availabilityLabel: string;
  openLabel: string;
  onOpen: () => void;
};

export default function ToolCard({ title, description, availabilityLabel, openLabel, onOpen }: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full min-h-[0] w-full flex-col rounded-lg border border-blue-300/45 bg-blue-500/10 p-3.5 text-left shadow-2xl shadow-black/35 transition-all hover:-translate-y-0.5 hover:border-blue-200/80 hover:bg-blue-500/15 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase text-blue-200">{availabilityLabel}</div>
          <h2 className="mt-1.5 text-base font-bold leading-5 text-white">{title}</h2>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-300">{description}</p>
      <div className="mt-auto flex justify-end pt-3">
        <span className="inline-flex items-center gap-2 rounded-md border border-blue-200/45 bg-blue-400/20 px-3 py-1.5 text-sm font-bold text-blue-50 shadow-[0_0_18px_rgba(96,165,250,0.22)] transition-all group-hover:border-blue-100/80 group-hover:bg-blue-400/30 group-hover:shadow-[0_0_24px_rgba(96,165,250,0.35)]">
          <span>{openLabel}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">-&gt;</span>
        </span>
      </div>
    </button>
  );
}
