import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MNIST_DEMO_FLOW_TOUR_STEP,
  MNIST_DEMO_PLAY_TOUR_STEP,
  PARAM_FORMULA_TOUR_STEP,
  TOUR_START_STEP,
  TOUR_STEPS,
  getClosedTourState,
  shouldCloseLayerInsightForTourStep,
} from './onboardingTourSteps.ts';

test('MNIST demo tour requires a real Play click before continuing to the flow explanation', () => {
  const playStepIndex = TOUR_STEPS.findIndex((step) => step.id === MNIST_DEMO_PLAY_TOUR_STEP);
  const flowStepIndex = TOUR_STEPS.findIndex((step) => step.id === MNIST_DEMO_FLOW_TOUR_STEP);

  assert.ok(playStepIndex > -1);
  assert.ok(flowStepIndex > playStepIndex);
  assert.equal(TOUR_STEPS[playStepIndex].target, '[data-tour="mnist-demo-play"]');
  assert.equal(TOUR_STEPS[playStepIndex].advanceOnTargetClick, true);
  assert.equal(TOUR_STEPS[playStepIndex].keepPanelCentered, true);
  assert.equal(TOUR_STEPS[flowStepIndex].target, '[data-tour="mnist-demo-flow"]');
  assert.equal(TOUR_STEPS[flowStepIndex].panelPlacement, 'canvas-side');
});

test('formula popup stays only during the parameter formula tour step', () => {
  const formulaStepIndex = TOUR_STEPS.findIndex((step) => step.id === PARAM_FORMULA_TOUR_STEP);
  const resetStepIndex = formulaStepIndex + 1;

  assert.ok(formulaStepIndex > -1);
  assert.equal(TOUR_STEPS[formulaStepIndex].target, '[data-tour="canvas-surface"]');
  assert.equal(shouldCloseLayerInsightForTourStep(PARAM_FORMULA_TOUR_STEP), false);
  assert.equal(shouldCloseLayerInsightForTourStep(TOUR_STEPS[resetStepIndex].id ?? `step-${resetStepIndex}`), true);
  assert.equal(shouldCloseLayerInsightForTourStep(null), true);
});

test('closed onboarding resets to the first step for the next manual open', () => {
  const closedState = getClosedTourState({
    step: TOUR_STEPS.length - 1,
    completedInteractions: { 4: true, 5: true },
  });

  assert.equal(closedState.step, TOUR_START_STEP);
  assert.deepEqual(closedState.completedInteractions, {});
});
