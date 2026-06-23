import type React from 'react';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';

export type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export type OperationEffectProps = {
  node: LayoutNode;
  segmentProgress: number;
  /**
   * Normalized 8x8 grayscale of the active input sample (derived from the
   * CIFAR-10 tile). Effects that show an input feature map use it so the demo
   * matches the image flowing in. Optional; effects fall back to a static
   * sample when absent.
   */
  sampleMatrix?: number[][];
  /**
   * CIFAR-10 class index of the active input sample. Classification effects
   * highlight this unit so the output prediction matches the input image.
   */
  targetClass?: number;
  t: DemoLabels;
};

export type OperationEffectComponent = React.FC<OperationEffectProps>;
