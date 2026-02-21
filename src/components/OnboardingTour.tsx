import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'torchviz-hasSeenTour';

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function markTourSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch { }
}

interface Step {
  target: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  { target: '[data-tour="editor"]', title: 'Editor', body: 'Write your PyTorch code here.' },
  { target: '[data-tour="visualize"]', title: 'Visualize', body: 'Click to build the 3D graph.' },
  { target: '[data-tour="canvas"]', title: 'Canvas', body: 'Left click to rotate, scroll to zoom. Click blocks to expand or collapse.' },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Cutout overlay: 4 panels dim the rest; highlighted area stays clear and visible. */
function CutoutOverlay({
  targetRect,
  onBackdropClick,
}: {
  targetRect: DOMRect;
  onBackdropClick: () => void;
}) {
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
      <div className="absolute top-0 left-0 right-0 cursor-pointer" style={{ height: Math.max(0, t), ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute left-0 cursor-pointer" style={{ top: Math.max(0, t), left: 0, width: Math.max(0, l), height: h, ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute cursor-pointer" style={{ top: Math.max(0, t), left: l + w, width: Math.max(0, vw - l - w), height: h, ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute left-0 right-0 bottom-0 cursor-pointer" style={{ top: t + h, height: Math.max(0, vh - t - h), ...overlayStyle }} onClick={onBackdropClick} />
    </>
  );
}

export default function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = useCallback(() => {
    const el = document.querySelector(STEPS[step]?.target);
    setTargetRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();
    const ro = new ResizeObserver(updateTargetRect);
    const el = document.querySelector(STEPS[step]?.target);
    if (el) ro.observe(el);
    window.addEventListener('scroll', updateTargetRect, true);
    window.addEventListener('resize', updateTargetRect);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', updateTargetRect, true);
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [isOpen, step, updateTargetRect]);

  if (!isOpen) return null;

  const s = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const handleDone = () => {
    markTourSeen();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Onboarding tour">
      {targetRect ? (
        <>
          <CutoutOverlay targetRect={targetRect} onBackdropClick={onClose} />
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
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={onClose} />
      )}
      <div
        className="absolute z-[102] glass-panel border border-[var(--border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-sm w-[90%] p-6 animate-in zoom-in-95 duration-200"
        style={(() => {
          const hasSpaceBelow = targetRect && targetRect.bottom + 160 < window.innerHeight;
          const cardW = Math.min(384, window.innerWidth * 0.9);
          const centerX = (window.innerWidth - cardW) / 2;
          const belowX = targetRect ? Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - cardW / 2, window.innerWidth - cardW - 16)) : 16;
          return {
            left: hasSpaceBelow ? belowX : centerX,
            top: hasSpaceBelow && targetRect ? targetRect.bottom + 20 : (window.innerHeight - 200) / 2,
            width: cardW,
            transform: hasSpaceBelow ? 'none' : 'translateY(-50%)',
          };
        })()}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">{s?.title}</h3>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-6">{s?.body}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 flex-1">
            {STEPS.map((_, i) => (
              <button
                key={STEPS[i]?.target ?? i}
                type="button"
                aria-label={`Step ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[var(--accent)] scale-125' : 'bg-[var(--border)] hover:bg-[var(--border-subtle)]'}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[#3f3f46] text-[var(--text)] transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              onClick={() => setStep((p) => p - 1)}
              disabled={isFirst}
            >
              Back
            </button>
            {isLast ? (
              <button
                type="button"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider"
                onClick={handleDone}
              >
                Done
              </button>
            ) : (
              <button
                type="button"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider"
                onClick={() => setStep((p) => p + 1)}
              >
                Next
              </button>
            )}
            <button
              type="button"
              className="text-xs font-medium px-3 py-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] transition-colors uppercase tracking-wider ml-1"
              onClick={() => {
                markTourSeen();
                onClose();
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
