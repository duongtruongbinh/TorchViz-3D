import { useEffect, useRef } from 'react';

type UseExerciseModalLifecycleOptions = {
  isOpen: boolean;
  onClose: () => void;
};

export function useExerciseModalLifecycle({ isOpen, onClose }: UseExerciseModalLifecycleOptions) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (!isOpen) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        const previousFocus = previousFocusRef.current;
        if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
      }
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    wasOpenRef.current = true;

    const frameId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return { closeButtonRef };
}
