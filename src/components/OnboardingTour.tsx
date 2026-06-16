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
  advanceOnTargetClick?: boolean;
  keepPanelCentered?: boolean;
  panelPlacement?: 'canvas-side';
  requiredPointerButton?: 0 | 2;
}

const STEPS: Step[] = [
  {
    target: '[data-tour="template-picker"]',
    title: 'Templates',
    body: 'Start from a model template when you want a quick example graph.',
  },
  {
    target: '[data-tour="input-shape"]',
    title: 'Input shape',
    body: 'Set the tensor shape used to trace the model and calculate layer outputs.',
  },
  { target: '[data-tour="editor"]', title: 'Editor', body: 'Write or adjust PyTorch-style model code here.' },
  {
    target: '[data-tour="visualize"]',
    title: 'Visualize',
    body: 'Click to run the model trace and build the 3D graph.',
    advanceOnTargetClick: true,
    keepPanelCentered: true,
  },
  {
    target: '[data-tour="canvas"]',
    title: 'Canvas: Left click',
    body: 'Left click and drag inside the canvas to pan the 3D view.',
    panelPlacement: 'canvas-side',
    requiredPointerButton: 0,
  },
  {
    target: '[data-tour="canvas"]',
    title: 'Canvas: Right click',
    body: 'Right click and drag inside the canvas to rotate the 3D view.',
    panelPlacement: 'canvas-side',
    requiredPointerButton: 2,
  },
  {
    target: '[data-tour="canvas"]',
    title: 'Layer blocks',
    body: 'Hover blocks to see names, input and output shapes, parameter counts, and why the layer matters.',
    panelPlacement: 'canvas-side',
  },
  {
    target: '[data-tour="reset-view"]',
    title: 'Reset view',
    body: 'Use this button to recenter the camera after panning, rotating, or zooming.',
  },
  {
    target: '[data-tour="explorer"]',
    title: 'Explorer',
    body: 'Browse the model tree, select layers, and open parameter formulas from underlined counts.',
  },
  {
    target: '[data-tour="details"]',
    title: 'Details',
    body: 'Selected layers show secondary metadata, formula breakdowns, source line, and errors here.',
  },
  {
    target: '[data-tour="terminal"]',
    title: 'Terminal',
    body: 'Build status, generated parameter totals, and runtime messages appear here.',
  },
  {
    target: '[data-tour="export-svg"]',
    title: 'Export SVG',
    body: 'Export the current graph as an SVG once a model has been visualized.',
  },
  {
    target: '[data-tour="help"]',
    title: 'Help',
    body: 'Open the help panel when you need controls, tips, or supported syntax.',
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onDone?: () => void;
  onStepChange?: () => void;
}

/** Cutout overlay: 4 panels dim the rest; highlighted area stays clear and visible. */
function CutoutOverlay({
  targetRect,
}: {
  targetRect: DOMRect;
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
      <div className="absolute top-0 left-0 right-0 pointer-events-auto" style={{ height: Math.max(0, t), ...overlayStyle }} />
      <div className="absolute left-0 pointer-events-auto" style={{ top: Math.max(0, t), left: 0, width: Math.max(0, l), height: h, ...overlayStyle }} />
      <div className="absolute pointer-events-auto" style={{ top: Math.max(0, t), left: l + w, width: Math.max(0, vw - l - w), height: h, ...overlayStyle }} />
      <div className="absolute left-0 right-0 bottom-0 pointer-events-auto" style={{ top: t + h, height: Math.max(0, vh - t - h), ...overlayStyle }} />
    </>
  );
}

export default function OnboardingTour({ isOpen, onClose, onSkip, onDone, onStepChange }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [completedInteractions, setCompletedInteractions] = useState<Record<number, boolean>>({});
  const prevStep = React.useRef(step);

  useEffect(() => {
    if (!isOpen) {
      prevStep.current = step;
      return;
    }
    if (prevStep.current === step) return;
    prevStep.current = step;
    onStepChange?.();
  }, [isOpen, step, onStepChange]);

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

  useEffect(() => {
    const currentStep = STEPS[step];
    if (!isOpen || !currentStep?.advanceOnTargetClick) return;

    const handleTargetClick = (event: MouseEvent) => {
      const el = document.querySelector(currentStep.target);
      if (!el?.contains(event.target as Node)) return;
      window.setTimeout(() => setStep((p) => Math.min(p + 1, STEPS.length - 1)), 0);
    };

    document.addEventListener('click', handleTargetClick, true);
    return () => document.removeEventListener('click', handleTargetClick, true);
  }, [isOpen, step]);

  useEffect(() => {
    const currentStep = STEPS[step];
    if (!isOpen || currentStep?.requiredPointerButton === undefined) return;

    const el = document.querySelector(currentStep.target);
    if (!el) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!el.contains(event.target as Node)) return;
      if (event.button !== currentStep.requiredPointerButton) return;
      setCompletedInteractions((prev) => ({ ...prev, [step]: true }));
    };

    const handleContextMenu = (event: Event) => {
      if (currentStep.requiredPointerButton !== 2 || !el.contains(event.target as Node)) return;
      event.preventDefault();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isOpen, step]);

  if (!isOpen) return null;

  const s = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const requiresTargetClick = !!s?.advanceOnTargetClick;
  const requiresInteraction = s?.requiredPointerButton !== undefined;
  const interactionDone = !requiresInteraction || !!completedInteractions[step];
  const canAdvance = !requiresTargetClick && interactionDone;
  const interactionTooltip = s?.requiredPointerButton === 2 ? 'Right click first' : 'Left click first';
  const maxReachableStep = Math.min(STEPS.length - 1, step + (canAdvance ? 1 : 0));

  const handleDone = () => {
    onStepChange?.();
    markTourSeen();
    onDone?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" role="dialog" aria-modal="true" aria-label="Onboarding tour">
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
          const cardW = Math.min(s?.panelPlacement === 'canvas-side' ? 320 : 384, window.innerWidth * 0.9);
          if (targetRect && s?.panelPlacement === 'canvas-side') {
            const gap = 20;
            const leftOfCanvas = targetRect.left - cardW - gap;
            const rightOfCanvas = targetRect.right + gap;
            const panelLeft = leftOfCanvas >= 16
              ? leftOfCanvas
              : Math.min(rightOfCanvas, window.innerWidth - cardW - 16);

            return {
              left: Math.max(16, panelLeft),
              top: Math.max(72, Math.min(targetRect.top + 72, window.innerHeight - 240)),
              width: cardW,
              transform: 'none',
            };
          }

          const hasSpaceBelow = targetRect && !s?.keepPanelCentered && targetRect.bottom + 160 < window.innerHeight;
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
        <button
          type="button"
          className="absolute top-4 right-5 text-[10px] font-medium text-[var(--text-dim)] hover:text-[var(--text-muted)] underline underline-offset-2 transition-colors uppercase tracking-wider"
          onClick={() => {
            markTourSeen();
            onSkip?.();
            onClose();
          }}
        >
          Skip
        </button>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2 pr-16">{s?.title}</h3>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-6">{s?.body}</p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <button
              type="button"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[#3f3f46] text-[var(--text)] transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              onClick={() => setStep((p) => p - 1)}
              disabled={isFirst}
            >
              Back
            </button>
          </div>
          <div className="flex items-center gap-1.5 justify-self-center">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Step ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[var(--accent)] scale-125' : 'bg-[var(--border)] hover:bg-[var(--border-subtle)]'}`}
                onClick={() => {
                  if (i > maxReachableStep) return;
                  setStep(i);
                }}
                disabled={i > maxReachableStep}
              />
            ))}
          </div>
          <div className="justify-self-end min-w-[72px] flex justify-end">
            {isLast ? (
              <span title={!canAdvance && requiresInteraction ? interactionTooltip : undefined}>
                <button
                  type="button"
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  onClick={handleDone}
                  disabled={!canAdvance}
                >
                  Done
                </button>
              </span>
            ) : !requiresTargetClick ? (
              <span title={!canAdvance && requiresInteraction ? interactionTooltip : undefined}>
                <button
                  type="button"
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                  onClick={() => setStep((p) => p + 1)}
                  disabled={!canAdvance}
                >
                  Next
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
