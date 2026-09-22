import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type TimelineItem = {
  year: string;
  title: ReactNode;
  event?: ReactNode;
  summary?: ReactNode;
  active?: boolean;
  track?: 'top' | 'bottom';
};

/** Extract a sortable numeric year from a year string like '1958', '1970s', '2000s', 'Mid-1970s'. */
function parseYear(yearStr: string): number {
  const match = yearStr.match(/\d{4}/);
  if (match) return parseInt(match[0], 10);
  return 0;
}

export function Timeline({
  items,
  caption,
}: {
  items: TimelineItem[];
  caption?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const targetItemRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isDualTrack = items.some((it) => it.track === 'bottom');

  // For dual-track: sort all items by year so they appear in chronological order on a shared axis
  const sortedItems = isDualTrack
    ? [...items].sort((a, b) => parseYear(a.year) - parseYear(b.year))
    : items;

  // Determine active item or default to the newest/last milestone
  const activeIndex = sortedItems.findIndex((it) => it.active);
  const targetIndex = activeIndex >= 0 ? activeIndex : sortedItems.length - 1;

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  // Position container at target milestone immediately on mount/update to prevent jerking
  useEffect(() => {
    const alignTimeline = () => {
      const container = scrollContainerRef.current;
      const target = targetItemRef.current;
      if (!container || !target) return;

      const containerWidth = container.clientWidth;
      const maxScroll = container.scrollWidth - containerWidth;
      if (maxScroll <= 0) {
        updateScrollState();
        return;
      }

      const targetRight = target.offsetLeft + target.offsetWidth;
      const desiredScrollLeft = Math.max(0, Math.min(maxScroll, targetRight - containerWidth + 24));
      container.scrollLeft = desiredScrollLeft;
      updateScrollState();
    };

    const frameId = requestAnimationFrame(alignTimeline);
    return () => cancelAnimationFrame(frameId);
  }, [sortedItems, targetIndex, updateScrollState]);

  const handleScrollBy = (offset: number) => {
    scrollContainerRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <figure className="my-4 w-full max-w-full min-w-0">
      <div className="relative group w-full overflow-hidden bg-white py-2 sm:py-3">
        {/* Left Scroll Navigation Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScrollBy(-240)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#205089] shadow-md ring-1 ring-slate-200/80 hover:bg-[#EFF3F8] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Cuộn về mốc trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Scroll Navigation Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScrollBy(240)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#205089] shadow-md ring-1 ring-slate-200/80 hover:bg-[#EFF3F8] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Cuộn đến mốc sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Track Legend (dual-track only) */}
        {isDualTrack && (
          <div className="flex flex-wrap items-center gap-3 px-1 mb-2 pb-1 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Luồng 1: Thị giác Cổ điển
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#205089]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#205089]" />
              Luồng 2: Mạng Nơ-ron &amp; Deep Learning
            </div>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          className="h-auto w-full overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin scrollbar-thumb-slate-200"
        >
          {/* DUAL-TRACK TIMELINE LAYOUT */}
          {isDualTrack ? (
            <div className="relative inline-flex flex-col min-w-full px-1 py-1">
              <div className="flex items-stretch justify-start min-w-max">
                {sortedItems.map((item, index) => {
                  const summaryText = item.summary || item.event;
                  const isTarget = index === targetIndex;
                  const isBottom = item.track === 'bottom';

                  const cardCls = isTarget
                    ? 'bg-[#EFF3F8] hover:bg-[#E3EAF2] border border-[#B8C8DA]/80 ring-1 ring-[#205089]/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs';

                  const stemCls = isTarget ? 'bg-[#205089]' : 'bg-slate-300';

                  const card = (
                    <div
                      className={`w-full flex-1 flex flex-col justify-start rounded-xl px-3 py-2.5 text-center transition-all duration-150 select-none ${cardCls}`}
                    >
                      <div
                        className={`font-mono text-xs sm:text-[13px] tracking-tight ${
                          isTarget ? 'font-bold text-[#205089]' : 'font-semibold text-slate-500'
                        }`}
                      >
                        {item.year}
                      </div>
                      <div
                        className={`mt-0.5 text-xs sm:text-[13px] tracking-tight leading-snug ${
                          isTarget ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'
                        }`}
                      >
                        {item.title}
                      </div>
                      {summaryText && (
                        <div
                          className={`mt-1.5 text-[11px] leading-relaxed ${
                            isTarget ? 'font-normal text-slate-600' : 'font-normal text-slate-500'
                          }`}
                        >
                          {summaryText}
                        </div>
                      )}
                    </div>
                  );

                  const stem = (
                    <div className={`w-[2px] h-3.5 sm:h-4 shrink-0 transition-colors duration-150 ${stemCls}`} />
                  );

                  return (
                    <div
                      key={index}
                      ref={isTarget ? targetItemRef : undefined}
                      className="flex flex-col items-center flex-1 min-w-[165px] sm:min-w-[195px] max-w-[245px] px-1.5 sm:px-2"
                    >
                      {/* Top half: card above axis (if top track) or empty space */}
                      <div className="w-full flex-1 flex flex-col justify-end items-center min-h-[110px]">
                        {!isBottom ? (
                          <>
                            {card}
                            {stem}
                          </>
                        ) : (
                          <div className="w-full flex-1" />
                        )}
                      </div>

                      {/* Shared horizontal axis node dot */}
                      <div className="relative w-full h-[2.5px] bg-slate-700/80 flex items-center justify-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full border-2 border-white shrink-0 z-10 ${
                            isTarget ? 'bg-[#205089] ring-2 ring-[#205089]/30' : 'bg-slate-400'
                          }`}
                        />
                      </div>

                      {/* Bottom half: card below axis (if bottom track) or empty space */}
                      <div className="w-full flex-1 flex flex-col justify-start items-center min-h-[110px]">
                        {isBottom ? (
                          <>
                            {stem}
                            {card}
                          </>
                        ) : (
                          <div className="w-full flex-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SINGLE-TRACK TIMELINE LAYOUT */
            <div className="relative inline-flex flex-col min-w-full px-1 pb-1 transition-all duration-150">
              <div className="flex items-stretch justify-start gap-3 sm:gap-4 min-w-max pb-0">
                {sortedItems.map((item, index) => {
                  const summaryText = item.summary || item.event;
                  const isTarget = index === targetIndex;

                  return (
                    <div
                      key={index}
                      ref={isTarget ? targetItemRef : undefined}
                      className="flex flex-col items-center flex-1 min-w-[155px] sm:min-w-[185px] max-w-[240px]"
                    >
                      <div
                        className={`w-full flex-1 flex flex-col justify-start rounded-xl px-3.5 py-3 text-center transition-all duration-150 select-none ${
                          isTarget
                            ? 'bg-[#EFF3F8] hover:bg-[#E3EAF2] border border-[#B8C8DA]/70 ring-1 ring-[#205089]/15'
                            : 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs'
                        }`}
                      >
                        <div
                          className={`font-mono text-xs sm:text-[13px] tracking-tight ${
                            isTarget ? 'font-bold text-[#205089]' : 'font-semibold text-slate-500'
                          }`}
                        >
                          {item.year}
                        </div>

                        <div
                          className={`mt-1 text-xs sm:text-[13px] tracking-tight leading-snug ${
                            isTarget ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'
                          }`}
                        >
                          {item.title}
                        </div>

                        {summaryText && (
                          <div
                            className={`mt-2 text-[11px] leading-relaxed ${
                              isTarget ? 'font-normal text-slate-600' : 'font-normal text-slate-500'
                            }`}
                          >
                            {summaryText}
                          </div>
                        )}
                      </div>

                      <div
                        className={`w-[2px] h-3.5 sm:h-4 shrink-0 transition-colors duration-150 ${
                          isTarget ? 'bg-[#205089]' : 'bg-slate-300'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Continuous Horizontal Baseline Axis */}
              <div className="relative w-full h-[2.5px] bg-slate-700/80 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-xs text-slate-500 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
