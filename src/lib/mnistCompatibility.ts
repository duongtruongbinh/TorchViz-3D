import type { LayoutData } from './irTypes';

export type MnistDemoCompatibilityReason =
  | 'loading'
  | 'no-layout'
  | 'input-shape'
  | 'missing-head';

export type MnistDemoCompatibility =
  | { ok: true }
  | { ok: false; reason: MnistDemoCompatibilityReason };

type DemoCompatibilityStop = {
  node: {
    is_container?: boolean;
    op_type: string;
    in_shape?: number[];
    out_shape?: number[];
  };
};

export function getMnistDemoCompatibility(
  stops: DemoCompatibilityStop[] | null,
  options: { loading?: boolean } = {},
): MnistDemoCompatibility {
  if (options.loading) return { ok: false, reason: 'loading' };
  if (!stops?.length) return { ok: false, reason: 'no-layout' };

  const firstLeaf = stops.find((stop) => !stop.node.is_container && stop.node.in_shape?.length);
  const input = firstLeaf?.node.in_shape ?? [];
  const hasMnistInput = input.length === 4 && input[1] === 1 && input[2] === 32 && input[3] === 32;
  if (!hasMnistInput) return { ok: false, reason: 'input-shape' };

  const hasTenClassHead = stops.some((stop) => {
    const outShape = stop.node.out_shape ?? [];
    return stop.node.op_type === 'Linear' && outShape[outShape.length - 1] === 10;
  });
  if (!hasTenClassHead) return { ok: false, reason: 'missing-head' };

  return { ok: true };
}

export function getMnistDemoLayoutAvailability(
  layout: LayoutData | null,
  stops: DemoCompatibilityStop[] | null,
  loading: boolean,
): MnistDemoCompatibility {
  if (loading) return { ok: false, reason: 'loading' };
  if (!layout) return { ok: false, reason: 'no-layout' };
  return getMnistDemoCompatibility(stops);
}
