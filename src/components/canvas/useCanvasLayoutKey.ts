import { useMemo } from 'react';
import type { LayoutData } from '../../lib/irTypes';
import { getCanvasLayoutKey } from '../../lib/canvasUtils';

export function useCanvasLayoutKey(layout: LayoutData | null): string {
  return useMemo(() => getCanvasLayoutKey(layout), [layout]);
}
