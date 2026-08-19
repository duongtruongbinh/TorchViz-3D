import {
  InteractiveStepper,
  type InteractiveStepperProps,
} from '../../../shell/InteractiveStepper';

export type MathStepperControlsProps = InteractiveStepperProps;

export function MathStepperControls(props: MathStepperControlsProps) {
  return <InteractiveStepper {...props} />;
}

