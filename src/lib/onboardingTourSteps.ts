export const TERMINAL_SUCCESS_TOUR_STEP = 'terminal-success';
export const TERMINAL_ERROR_TOUR_STEP = 'terminal-error';
export const PARAM_FORMULA_TOUR_STEP = 'param-formula';
export const MNIST_DEMO_TOGGLE_TOUR_STEP = 'mnist-demo-toggle';
export const MNIST_DEMO_PLAY_TOUR_STEP = 'mnist-demo-play';
export const MNIST_DEMO_FLOW_TOUR_STEP = 'mnist-demo-flow';
export const TOUR_START_STEP = 0;

export interface TourStep {
  id?: string;
  target: string;
  textIndex: number;
  advanceOnTargetClick?: boolean;
  keepPanelCentered?: boolean;
  panelPlacement?: 'canvas-side';
  requiredPointerButton?: 0 | 2;
  avoidOverlapWith?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="template-picker"]',
    textIndex: 0,
  },
  {
    target: '[data-tour="input-shape"]',
    textIndex: 1,
  },
  { target: '[data-tour="editor"]', textIndex: 2 },
  {
    target: '[data-tour="visualize"]',
    textIndex: 3,
    advanceOnTargetClick: true,
    keepPanelCentered: true,
  },
  {
    target: '[data-tour="canvas-surface"]',
    textIndex: 4,
    panelPlacement: 'canvas-side',
    requiredPointerButton: 0,
    avoidOverlapWith: '[data-tour="terminal"]',
  },
  {
    target: '[data-tour="canvas-surface"]',
    textIndex: 5,
    panelPlacement: 'canvas-side',
    requiredPointerButton: 2,
    avoidOverlapWith: '[data-tour="terminal"]',
  },
  {
    id: PARAM_FORMULA_TOUR_STEP,
    target: '[data-tour="canvas-surface"]',
    textIndex: 6,
    panelPlacement: 'canvas-side',
    avoidOverlapWith: '[data-tour="terminal"]',
  },
  {
    target: '[data-tour="reset-view"]',
    textIndex: 7,
  },
  {
    target: '[data-tour="structure"]',
    textIndex: 8,
  },
  {
    target: '[data-tour="details"]',
    textIndex: 9,
  },
  {
    id: TERMINAL_SUCCESS_TOUR_STEP,
    target: '[data-tour="terminal"]',
    textIndex: 10,
  },
  {
    id: TERMINAL_ERROR_TOUR_STEP,
    target: '[data-tour="terminal"]',
    textIndex: 11,
  },
  {
    id: MNIST_DEMO_TOGGLE_TOUR_STEP,
    target: '[data-tour="mnist-demo-toggle"]',
    textIndex: 12,
    advanceOnTargetClick: true,
    keepPanelCentered: true,
  },
  {
    id: MNIST_DEMO_PLAY_TOUR_STEP,
    target: '[data-tour="mnist-demo-play"]',
    textIndex: 13,
    advanceOnTargetClick: true,
    keepPanelCentered: true,
  },
  {
    id: MNIST_DEMO_FLOW_TOUR_STEP,
    target: '[data-tour="mnist-demo-flow"]',
    textIndex: 14,
    panelPlacement: 'canvas-side',
    avoidOverlapWith: '[data-tour="terminal"]',
  },
  {
    target: '[data-tour="export-svg"]',
    textIndex: 15,
  },
  {
    target: '[data-tour="help"]',
    textIndex: 16,
  },
];

export function shouldCloseLayerInsightForTourStep(stepId: string | null): boolean {
  return stepId !== PARAM_FORMULA_TOUR_STEP;
}

export interface TourRuntimeState {
  step: number;
  completedInteractions: Record<number, boolean>;
}

export function getClosedTourState(_state: TourRuntimeState): TourRuntimeState {
  return {
    step: TOUR_START_STEP,
    completedInteractions: {},
  };
}
