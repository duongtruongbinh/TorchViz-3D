import type { LayoutData } from './irTypes';

/**
 * Forward-pass (a.k.a. "demo mode") compatibility.
 *
 * Historically this gate was MNIST/LeNet-specific (required a `[N,1,32,32]`
 * input and a 10-class `Linear` head). It is now generalized: the animated
 * forward pass runs for any graph that has at least one ordered leaf stop with
 * a known input shape. The remaining reasons only describe states where there
 * is nothing to animate yet.
 */
export type ForwardPassCompatibilityReason =
  | 'loading'
  | 'no-layout'
  | 'no-stops';

export type ForwardPassCompatibility =
  | { ok: true }
  | { ok: false; reason: ForwardPassCompatibilityReason };

/** @deprecated Use {@link ForwardPassCompatibilityReason}. */
export type MnistDemoCompatibilityReason = ForwardPassCompatibilityReason;
/** @deprecated Use {@link ForwardPassCompatibility}. */
export type MnistDemoCompatibility = ForwardPassCompatibility;

type DemoCompatibilityStop = {
  node: {
    is_container?: boolean;
    op_type: string;
    in_shape?: number[];
    out_shape?: number[];
  };
};

export function getForwardPassCompatibility(
  stops: DemoCompatibilityStop[] | null,
  options: { loading?: boolean } = {},
): ForwardPassCompatibility {
  if (options.loading) return { ok: false, reason: 'loading' };
  if (!stops?.length) return { ok: false, reason: 'no-layout' };

  // Need at least one leaf with a known input shape to seed the input packet.
  const hasSeedableLeaf = stops.some(
    (stop) => !stop.node.is_container && (stop.node.in_shape?.length ?? 0) > 0,
  );
  if (!hasSeedableLeaf) return { ok: false, reason: 'no-stops' };

  return { ok: true };
}

/** @deprecated Use {@link getForwardPassCompatibility}. */
export const getMnistDemoCompatibility = getForwardPassCompatibility;

export function getForwardPassLayoutAvailability(
  layout: LayoutData | null,
  stops: DemoCompatibilityStop[] | null,
  loading: boolean,
): ForwardPassCompatibility {
  if (loading) return { ok: false, reason: 'loading' };
  if (!layout) return { ok: false, reason: 'no-layout' };
  return getForwardPassCompatibility(stops);
}

/** @deprecated Use {@link getForwardPassLayoutAvailability}. */
export const getMnistDemoLayoutAvailability = getForwardPassLayoutAvailability;
