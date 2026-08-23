import { type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export type FlowchartNode = {
  id?: string;
  step?: string | number;
  title: ReactNode;
  subtitle?: ReactNode;
  tag?: string;
  isEnd?: boolean;
};

export function Flowchart({
  nodes,
  caption,
}: {
  nodes: FlowchartNode[];
  caption?: string;
}) {
  return (
    <figure className="my-6 w-full max-w-full">
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-max">
          {nodes.map((node, index) => {
            const isLast = index === nodes.length - 1;
            const stepNumber = node.step ?? index + 1;

            return (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3">
                {/* Minimalist Node Box */}
                <div
                  className={`flex flex-col justify-between w-52 sm:w-56 rounded-xl border px-4 py-3.5 transition-shadow ${
                    node.isEnd
                      ? 'border-rose-200 bg-white shadow-xs'
                      : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider">
                      {typeof stepNumber === 'number' ? `0${stepNumber}` : stepNumber}
                    </span>
                    {node.tag && (
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                          node.isEnd
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
                        node.isEnd ? 'text-rose-900' : 'text-slate-900'
                      }`}
                    >
                      {node.title}
                    </h5>
                    {node.subtitle && (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 font-normal">
                        {node.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Minimalist Connecting Arrow */}
                {!isLast && (
                  <div className="flex items-center justify-center text-slate-300 py-0.5 sm:py-0 shrink-0">
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
