import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'torchviz-hasSeenTour';

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTourSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {}
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
      <div className="absolute top-0 left-0 right-0 backdrop-blur-sm cursor-pointer" style={{ height: t, ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute left-0 backdrop-blur-sm cursor-pointer" style={{ top: t, left: 0, width: l, height: h, ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute backdrop-blur-sm cursor-pointer" style={{ top: t, left: l + w, width: vw - l - w, height: h, ...overlayStyle }} onClick={onBackdropClick} />
      <div className="absolute left-0 right-0 bottom-0 backdrop-blur-sm cursor-pointer" style={{ top: t + h, height: vh - t - h, ...overlayStyle }} onClick={onBackdropClick} />
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
            className="absolute pointer-events-none border-2 border-blue-400 rounded-lg ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent tour-spotlight-pulse"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} onClick={onClose} />
      )}
      <div
        className="absolute z-10 bg-zinc-900 border border-zinc-600 rounded-xl shadow-2xl max-w-sm w-[90%] p-5"
        style={(() => {
          const hasSpaceBelow = targetRect && targetRect.bottom + 150 < window.innerHeight;
          const cardW = Math.min(384, window.innerWidth * 0.9);
          const centerX = (window.innerWidth - cardW) / 2;
          const belowX = targetRect ? Math.max(12, Math.min(targetRect.left + targetRect.width / 2 - cardW / 2, window.innerWidth - cardW - 12)) : 12;
          return {
            left: hasSpaceBelow ? belowX : centerX,
            top: hasSpaceBelow && targetRect ? targetRect.bottom + 16 : (window.innerHeight - 180) / 2,
            width: cardW,
            transform: hasSpaceBelow ? 'none' : 'translateY(-50%)',
          };
        })()}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-zinc-100 mb-2">{s?.title}</h3>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">{s?.body}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Step ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-zinc-600 hover:bg-zinc-500'}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setStep((p) => p - 1)}
              disabled={isFirst}
            >
              Previous
            </button>
            {isLast ? (
              <button
                type="button"
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                onClick={handleDone}
              >
                Done
              </button>
            ) : (
              <button
                type="button"
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                onClick={() => setStep((p) => p + 1)}
              >
                Next
              </button>
            )}
            <button
              type="button"
              className="text-xs font-medium px-2 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
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
