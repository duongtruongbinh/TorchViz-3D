import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export type FlowchartNode = {
  id?: string;
  step?: string | number;
  title: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  tag?: string;
  isEnd?: boolean;
  active?: boolean;
};

export function Flowchart({
  nodes,
  items,
  caption,
  ariaLabel,
}: {
  nodes?: FlowchartNode[];
  items?: FlowchartNode[];
  caption?: string;
  ariaLabel?: string;
}) {
  const nodeList = nodes ?? items ?? [];
  return (
    <figure className="my-6 w-full max-w-full min-w-0" aria-label={ariaLabel}>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-max">
          {nodeList.map((node, index) => {
            const isLast = index === nodeList.length - 1;
            const stepNumber = node.step ?? index + 1;

            return (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                {/* Minimalist Node Box */}
                <div
                  className={`flex flex-col justify-between w-52 sm:w-56 rounded-xl border px-4 py-3.5 transition-all ${
                    node.active
                      ? 'border-[#205089] bg-[#EFF3F8] shadow-xs ring-2 ring-[#205089]/25'
                      : node.isEnd
                        ? 'border-rose-200 bg-white shadow-xs'
                        : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[11px] tracking-wider ${
                        node.active
                          ? 'font-bold text-[#205089]'
                          : 'font-semibold text-slate-400'
                      }`}
                    >
                      {typeof stepNumber === 'number' ? `0${stepNumber}` : stepNumber}
                    </span>
                    {node.tag && (
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                          node.active
                            ? 'bg-[#205089] text-white border border-[#205089]'
                            : node.isEnd
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                        }`}
                      >
                        {node.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h5
                      className={`text-xs font-bold tracking-tight ${
                        node.active
                          ? 'text-[#205089]'
                          : node.isEnd
                            ? 'text-rose-900'
                            : 'text-slate-900'
                      }`}
                    >
                      {node.title}
                    </h5>
                    {(node.subtitle ?? node.detail) && (
                      <p
                        className={`mt-1 text-[11px] leading-relaxed font-normal ${
                          node.active ? 'text-[#205089]/80' : 'text-slate-500'
                        }`}
                      >
                        {node.subtitle ?? node.detail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Minimalist Connecting Arrow */}
                {!isLast && (
                  <div className="flex items-center justify-center py-0.5 sm:py-0 shrink-0">
                    <ArrowRight className="size-4 hidden sm:block text-slate-400" strokeWidth={1.75} />
                    <ArrowRight className="size-4 rotate-90 sm:hidden text-slate-400 my-1" strokeWidth={1.75} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs leading-normal text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
