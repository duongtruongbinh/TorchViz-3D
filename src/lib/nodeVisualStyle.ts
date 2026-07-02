import type { LayoutNode } from './irTypes.ts';
import { ERROR_COLOR } from './constants.ts';

export function getLayoutNodeBaseColor(node: Pick<LayoutNode, 'color' | 'error'>): string {
  return node.error ? ERROR_COLOR : node.color;
}
