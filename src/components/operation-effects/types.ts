import type React from 'react';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';

export type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export type OperationEffectProps = {
  node: LayoutNode;
  segmentProgress: number;
  t: DemoLabels;
};

export type OperationEffectComponent = React.FC<OperationEffectProps>;
