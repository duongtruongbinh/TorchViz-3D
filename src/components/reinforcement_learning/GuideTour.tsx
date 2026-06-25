import { useCallback, useEffect, useState } from 'react';

import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type GuideTourProps = {
  isOpen: boolean;
  onClose: () => void;
};

type GuideTourStep = {
  target: string;
  title: string;
  body: string;
  keepPanelCentered?: boolean;
  panelPlacement?: 'canvas-side';
  avoidOverlapWith?: string;
};

function CutoutOverlay({ targetRect }: { targetRect: DOMRect }) {
  const pad = 6;
  const t = targetRect.top - pad;
  const l = targetRect.left - pad;
  const w = targetRect.width + pad * 2;
  const h = targetRect.height + pad * 2;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const overlayStyle = { backgroundColor: 'rgba(0, 0, 0, 0.85)' };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 pointer-events-auto" style={{ height: Math.max(0, t), ...overlayStyle }} />
      <div className="absolute left-0 pointer-events-auto" style={{ top: Math.max(0, t), left: 0, width: Math.max(0, l), height: h, ...overlayStyle }} />
      <div className="absolute pointer-events-auto" style={{ top: Math.max(0, t), left: l + w, width: Math.max(0, vw - l - w), height: h, ...overlayStyle }} />
      <div className="absolute left-0 right-0 bottom-0 pointer-events-auto" style={{ top: t + h, height: Math.max(0, vh - t - h), ...overlayStyle }} />
    </>
  );
}

function rectsOverlapHorizontally(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left;
}

function getStepTargetRect(step: GuideTourStep): DOMRect | null {
  const target = document.querySelector(step.target);
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  if (!step.avoidOverlapWith) return rect;

  const overlapElement = document.querySelector(step.avoidOverlapWith);
  if (!overlapElement) return rect;

  const overlapRect = overlapElement.getBoundingClientRect();
  const overlapsBottom =
    rectsOverlapHorizontally(rect, overlapRect) &&
    overlapRect.top > rect.top &&
    overlapRect.top < rect.bottom;

  if (!overlapsBottom) return rect;

  const bottomClearance = 8;
  const nextBottom = Math.max(rect.top, overlapRect.top - bottomClearance);
  return new DOMRect(rect.left, rect.top, rect.width, nextBottom - rect.top);
}

export default function GuideTour({ isOpen, onClose }: GuideTourProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const steps = t.guideTour.steps as GuideTourStep[];
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = useCallback(() => {
    const step = steps[stepIndex];
    setTargetRect(step ? getStepTargetRect(step) : null);
  }, [stepIndex, steps]);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setTargetRect(null);
      return;
    }

    updateTargetRect();
    const resizeObserver = new ResizeObserver(updateTargetRect);
    const element = document.querySelector(steps[stepIndex]?.target);
    if (element) resizeObserver.observe(element);
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, stepIndex, steps, updateTargetRect]);

  if (!isOpen || steps.length === 0) return null;

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const maxReachableStep = Math.min(steps.length - 1, stepIndex + 1);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" role="dialog" aria-modal="true" aria-label={t.guideTour.ariaLabel}>
      {targetRect ? (
        <>
          <CutoutOverlay targetRect={targetRect} />
          <div
            className="absolute pointer-events-none border-2 border-[var(--accent)] rounded-lg ring-2 ring-[var(--accent)]/50 ring-offset-2 ring-offset-[#000000] tour-spotlight-pulse z-[101]"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 pointer-events-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
      )}
      <div
        className="absolute z-[102] glass-panel border border-[var(--border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-sm w-[90%] p-6 animate-in zoom-in-95 duration-200 pointer-events-auto"
        style={(() => {
          const cardWidth = Math.min(step.panelPlacement === 'canvas-side' ? 320 : 384, window.innerWidth * 0.9);
          if (targetRect && step.panelPlacement === 'canvas-side') {
            const gap = 20;
            const leftOfTarget = targetRect.left - cardWidth - gap;
            const rightOfTarget = targetRect.right + gap;
            const panelLeft = leftOfTarget >= 16
              ? leftOfTarget
              : Math.min(rightOfTarget, window.innerWidth - cardWidth - 16);

            return {
              left: Math.max(16, panelLeft),
              top: Math.max(72, Math.min(targetRect.top + 72, window.innerHeight - 240)),
              width: cardWidth,
              transform: 'none',
            };
          }

          const hasSpaceBelow = targetRect && !step.keepPanelCentered && targetRect.bottom + 160 < window.innerHeight;
          const centerX = (window.innerWidth - cardWidth) / 2;
          const belowX = targetRect
            ? Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - cardWidth / 2, window.innerWidth - cardWidth - 16))
            : 16;

          return {
            left: hasSpaceBelow ? belowX : centerX,
            top: hasSpaceBelow && targetRect ? targetRect.bottom + 20 : (window.innerHeight - 200) / 2,
            width: cardWidth,
            transform: hasSpaceBelow ? 'none' : 'translateY(-50%)',
          };
        })()}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-[10px] font-medium text-[var(--text-dim)] hover:text-[var(--text-muted)] underline underline-offset-2 transition-colors uppercase tracking-wider"
        >
          {t.guideTour.skip}
        </button>
        <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-2">
          {t.guideTour.stepLabel(stepIndex + 1, steps.length)}
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2 pr-16">{step.title}</h3>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-6">{step.body}</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              disabled={isFirst}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[#3f3f46] text-[var(--text)] transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {t.guideTour.back}
            </button>
            <div className="min-w-[72px] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isLast) {
                    onClose();
                    return;
                  }
                  setStepIndex((value) => Math.min(steps.length - 1, value + 1));
                }}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider"
              >
                {isLast ? t.guideTour.done : t.guideTour.next}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-2">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t.guideTour.stepLabel(index + 1, steps.length)}
                className={`w-2 h-2 rounded-full transition-all ${index === stepIndex ? 'bg-[var(--accent)] scale-125' : 'bg-[var(--border)] hover:bg-[var(--border-subtle)]'}`}
                onClick={() => {
                  if (index > maxReachableStep) return;
                  setStepIndex(index);
                }}
                disabled={index > maxReachableStep}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
