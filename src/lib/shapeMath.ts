export type Shape2DParam = number | readonly [number, number];

export type Conv2dShapeConfig = {
  outChannels: number;
  kernelSize: Shape2DParam;
  stride?: Shape2DParam;
  padding?: Shape2DParam;
  dilation?: Shape2DParam;
};

export type Pool2dShapeConfig = {
  kernelSize: Shape2DParam;
  stride?: Shape2DParam;
  padding?: Shape2DParam;
  dilation?: Shape2DParam;
};

export type SpatialShapeSteps = {
  input: number;
  kernel: number;
  stride: number;
  padding: number;
  dilation: number;
  numerator: number;
  output: number;
};

export type SpatialShapeBreakdown = {
  h: SpatialShapeSteps;
  w: SpatialShapeSteps;
};

export function normalize2DParam(value: Shape2DParam): [number, number] {
  if (Array.isArray(value)) {
    if (value.length !== 2) throw new Error('2D parameter tuple must have length 2');
    return [
      normalizeInteger(value[0], '2D parameter', { min: 0 }),
      normalizeInteger(value[1], '2D parameter', { min: 0 }),
    ];
  }
  const normalized = normalizeInteger(value, '2D parameter', { min: 0 });
  return [normalized, normalized];
}

export function getConv2dOutputShape(input: number[], config: Conv2dShapeConfig): number[] {
  assertNchw(input, 'Conv2d');
  const [kh, kw] = normalize2DParam(config.kernelSize);
  const [sh, sw] = normalize2DParam(config.stride ?? 1);
  const [ph, pw] = normalize2DParam(config.padding ?? 0);
  const [dh, dw] = normalize2DParam(config.dilation ?? 1);
  const outChannels = normalizeInteger(config.outChannels, 'outChannels');
  const h = computeSpatialOutput(input[2], kh, sh, ph, dh, 'height');
  const w = computeSpatialOutput(input[3], kw, sw, pw, dw, 'width');
  return [input[0], outChannels, h.output, w.output];
}

export function getPool2dOutputShape(input: number[], config: Pool2dShapeConfig): number[] {
  assertNchw(input, 'Pool2d');
  const [kh, kw] = normalize2DParam(config.kernelSize);
  const [sh, sw] = normalize2DParam(config.stride ?? config.kernelSize);
  const [ph, pw] = normalize2DParam(config.padding ?? 0);
  const [dh, dw] = normalize2DParam(config.dilation ?? 1);
  const h = computeSpatialOutput(input[2], kh, sh, ph, dh, 'height');
  const w = computeSpatialOutput(input[3], kw, sw, pw, dw, 'width');
  return [input[0], input[1], h.output, w.output];
}

export function getLinearOutputShape(input: number[], outFeatures: number): number[] {
  if (input.length < 1) throw new Error('Linear expects rank >= 1 input');
  const normalizedOut = normalizeInteger(outFeatures, 'outFeatures');
  return [...input.slice(0, -1), normalizedOut];
}

export function getPassthroughOutputShape(input: number[]): number[] {
  return [...input];
}

export function getConv2dShapeBreakdown(input: number[], config: Conv2dShapeConfig): SpatialShapeBreakdown {
  assertNchw(input, 'Conv2d');
  const [kh, kw] = normalize2DParam(config.kernelSize);
  const [sh, sw] = normalize2DParam(config.stride ?? 1);
  const [ph, pw] = normalize2DParam(config.padding ?? 0);
  const [dh, dw] = normalize2DParam(config.dilation ?? 1);
  return {
    h: computeSpatialOutput(input[2], kh, sh, ph, dh, 'height'),
    w: computeSpatialOutput(input[3], kw, sw, pw, dw, 'width'),
  };
}

export function getPool2dShapeBreakdown(input: number[], config: Pool2dShapeConfig): SpatialShapeBreakdown {
  assertNchw(input, 'Pool2d');
  const [kh, kw] = normalize2DParam(config.kernelSize);
  const [sh, sw] = normalize2DParam(config.stride ?? config.kernelSize);
  const [ph, pw] = normalize2DParam(config.padding ?? 0);
  const [dh, dw] = normalize2DParam(config.dilation ?? 1);
  return {
    h: computeSpatialOutput(input[2], kh, sh, ph, dh, 'height'),
    w: computeSpatialOutput(input[3], kw, sw, pw, dw, 'width'),
  };
}

function computeSpatialOutput(
  input: number,
  kernel: number,
  stride: number,
  padding: number,
  dilation: number,
  axis: string,
): SpatialShapeSteps {
  normalizeInteger(input, `${axis} input`);
  normalizeInteger(kernel, `${axis} kernel`);
  normalizeInteger(stride, `${axis} stride`);
  normalizeInteger(padding, `${axis} padding`, { min: 0 });
  normalizeInteger(dilation, `${axis} dilation`);

  const numerator = input + 2 * padding - dilation * (kernel - 1) - 1;
  const output = Math.floor(numerator / stride + 1);
  if (output <= 0) {
    throw new Error(`Invalid output ${axis}: ${output}`);
  }
  return { input, kernel, stride, padding, dilation, numerator, output };
}

function assertNchw(input: number[], opType: string): void {
  if (input.length !== 4) {
    throw new Error(`${opType} expects input shape [N,C,H,W]`);
  }
  for (const [index, dim] of input.entries()) {
    normalizeInteger(dim, `input dim ${index}`);
  }
}

function normalizeInteger(value: number, label: string, options: { min?: number } = {}): number {
  const min = options.min ?? 1;
  if (!Number.isInteger(value) || value < min) {
    throw new Error(`${label} must be an integer >= ${min}`);
  }
  return value;
}
