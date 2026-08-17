import React, { useState, useEffect, useCallback } from 'react';
import { getStrings } from '../lib/localization';
import {
  TERMINAL_ERROR_TOUR_STEP,
  TERMINAL_SUCCESS_TOUR_STEP,
  TOUR_STEPS,
  getClosedTourState,
  type TourStep,
} from '../lib/onboardingTourSteps';
import { usePreferencesStore } from '../store/usePreferencesStore';

const STORAGE_KEY = 'torchviz-hasSeenTour';
export { TERMINAL_ERROR_TOUR_STEP, TERMINAL_SUCCESS_TOUR_STEP };

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

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onDone?: () => void;
  onStepChange?: (stepTitle: string | null) => void;
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

function rectContainsPoint(rect: DOMRect, x: number, y: number): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function rectsOverlapHorizontally(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left;
}

function getStepTargetRect(step: TourStep): DOMRect | null {
  const target = document.querySelector(step.target);
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  if (!step.avoidOverlapWith) return rect;

  const overlapEl = document.querySelector(step.avoidOverlapWith);
  if (!overlapEl) return rect;

  const overlapRect = overlapEl.getBoundingClientRect();
  const overlapsBottom =
    rectsOverlapHorizontally(rect, overlapRect) &&
    overlapRect.top > rect.top &&
    overlapRect.top < rect.bottom;

  if (!overlapsBottom) return rect;

  const bottomClearance = 8;
  const nextBottom = Math.max(rect.top, overlapRect.top - bottomClearance);
  return new DOMRect(rect.left, rect.top, rect.width, nextBottom - rect.top);
}

export default function OnboardingTour({ isOpen, onClose, onSkip, onDone, onStepChange }: OnboardingTourProps) {
  const language = usePreferencesStore((state) => state.language);
  const t = getStrings(language);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [completedInteractions, setCompletedInteractions] = useState<Record<number, boolean>>({});
  const prevStep = React.useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      const closedState = getClosedTourState({ step, completedInteractions });
      if (step !== closedState.step) setStep(closedState.step);
      if (Object.keys(completedInteractions).length > 0) setCompletedInteractions(closedState.completedInteractions);
      prevStep.current = null;
      onStepChange?.(null);
      return;
    }
    if (prevStep.current === step) return;
    prevStep.current = step;
    onStepChange?.(TOUR_STEPS[step]?.id ?? `step-${step}`);
  }, [isOpen, step, onStepChange]);

  const updateTargetRect = useCallback(() => {
    const currentStep = TOUR_STEPS[step];
    setTargetRect(currentStep ? getStepTargetRect(currentStep) : null);
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();
    const ro = new ResizeObserver(updateTargetRect);
    const el = document.querySelector(TOUR_STEPS[step]?.target);
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
    const currentStep = TOUR_STEPS[step];
    if (!isOpen || !currentStep?.advanceOnTargetClick) return;

    const handleTargetClick = (event: MouseEvent) => {
      const el = document.querySelector(currentStep.target);
      if (!el?.contains(event.target as Node)) return;
      window.setTimeout(() => setStep((p) => Math.min(p + 1, TOUR_STEPS.length - 1)), 0);
    };

    document.addEventListener('click', handleTargetClick, true);
    return () => document.removeEventListener('click', handleTargetClick, true);
  }, [isOpen, step]);

  useEffect(() => {
    const currentStep = TOUR_STEPS[step];
    if (!isOpen || currentStep?.requiredPointerButton === undefined) return;

    const el = document.querySelector(currentStep.target);
    if (!el) return;

    const handlePointerDown = (event: PointerEvent) => {
      const rect = getStepTargetRect(currentStep);
      if (!rect || !rectContainsPoint(rect, event.clientX, event.clientY)) return;
      if (event.button !== currentStep.requiredPointerButton) return;
      setCompletedInteractions((prev) => ({ ...prev, [step]: true }));
    };

    const handleContextMenu = (event: Event) => {
      if (currentStep.requiredPointerButton !== 2) return;
      const pointerEvent = event as PointerEvent;
      const rect = getStepTargetRect(currentStep);
      if (!rect || !rectContainsPoint(rect, pointerEvent.clientX, pointerEvent.clientY)) return;
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

  const s = TOUR_STEPS[step];
  const stepText = t.tour.steps[s.textIndex];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;
  const requiresTargetClick = !!s?.advanceOnTargetClick;
  const requiresInteraction = s?.requiredPointerButton !== undefined;
  const interactionDone = !requiresInteraction || !!completedInteractions[step];
  const canAdvance = !requiresTargetClick && interactionDone;
  const interactionTooltip = s?.requiredPointerButton === 2 ? t.tour.rightClickFirst : t.tour.leftClickFirst;
  const maxReachableStep = Math.min(TOUR_STEPS.length - 1, step + (canAdvance ? 1 : 0));

  const handleDone = () => {
    onStepChange?.(null);
    markTourSeen();
    onDone?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" role="dialog" aria-modal="true" aria-label={t.tour.ariaLabel}>
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
          {t.tour.skip}
        </button>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2 pr-16">{stepText.title}</h3>
        <p className="text-[var(--text-muted)] text-[15px] leading-relaxed mb-6">{stepText.body}</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[#3f3f46] text-[var(--text)] transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              onClick={() => setStep((p) => p - 1)}
              disabled={isFirst}
            >
              {t.tour.back}
            </button>
            <div className="min-w-[72px] flex justify-end">
              {isLast ? (
                <span title={!canAdvance && requiresInteraction ? interactionTooltip : undefined}>
                  <button
                    type="button"
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                    onClick={handleDone}
                    disabled={!canAdvance}
                  >
                    {t.tour.done}
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
                    {t.tour.next}
                  </button>
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-2">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={t.tour.stepLabel(i + 1)}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[var(--accent)] scale-125' : 'bg-[var(--border)] hover:bg-[var(--border-subtle)]'}`}
                onClick={() => {
                  if (i > maxReachableStep) return;
                  setStep(i);
                }}
                disabled={i > maxReachableStep}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
