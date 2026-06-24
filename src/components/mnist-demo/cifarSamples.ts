/**
 * CIFAR-10-style input samples for the forward-pass animation.
 *
 * Real CIFAR-10 binaries are not bundled (the app is fully offline), so these
 * are compact *procedurally rendered* 3-channel RGB scenes representing CIFAR-10
 * classes. They give the forward pass a real colour image input (matching the
 * 3-channel image-classification nature of most templates) instead of the old
 * MNIST grayscale digit. A small rotating set is used; one sample is picked per
 * layout/template so different architectures show different inputs.
 */

/** The canonical CIFAR-10 class order (index 0-9). */
export const CIFAR_CLASS_NAMES = [
  'airplane',
  'automobile',
  'bird',
  'cat',
  'deer',
  'dog',
  'frog',
  'horse',
  'ship',
  'truck',
];

export type CifarSample = {
  /** CIFAR-10 class label, shown next to the input tile. */
  label: string;
  /** Index into {@link CIFAR_CLASS_NAMES}; the prediction the output highlights. */
  classIndex: number;
  /** Draws the scene into a square 2D context of the given pixel size. */
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
};

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function verticalGradient(
  ctx: CanvasRenderingContext2D,
  size: number,
  top: [number, number, number],
  bottom: [number, number, number],
  fromY = 0,
  toY = size,
) {
  for (let y = Math.floor(fromY); y < Math.ceil(toY); y++) {
    const t = (y - fromY) / Math.max(1, toY - fromY);
    ctx.fillStyle = lerpColor(top, bottom, t);
    ctx.fillRect(0, y, size, 1);
  }
}

export const CIFAR_SAMPLES: CifarSample[] = [
  {
    label: 'Ship',
    classIndex: 8,
    draw: (ctx, s) => {
      verticalGradient(ctx, s, [150, 196, 236], [206, 226, 244], 0, s * 0.55); // sky
      verticalGradient(ctx, s, [38, 92, 140], [18, 52, 92], s * 0.55, s); // sea
      // hull
      ctx.fillStyle = '#3a3f4b';
      ctx.beginPath();
      ctx.moveTo(s * 0.22, s * 0.62);
      ctx.lineTo(s * 0.78, s * 0.62);
      ctx.lineTo(s * 0.68, s * 0.74);
      ctx.lineTo(s * 0.32, s * 0.74);
      ctx.closePath();
      ctx.fill();
      // sail
      ctx.fillStyle = '#eef2f7';
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.24);
      ctx.lineTo(s * 0.5, s * 0.6);
      ctx.lineTo(s * 0.66, s * 0.6);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    label: 'Airplane',
    classIndex: 0,
    draw: (ctx, s) => {
      verticalGradient(ctx, s, [96, 150, 214], [176, 208, 240], 0, s); // sky
      ctx.fillStyle = '#4b5563';
      // fuselage
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.5, s * 0.32, s * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      // wings
      ctx.beginPath();
      ctx.moveTo(s * 0.46, s * 0.5);
      ctx.lineTo(s * 0.58, s * 0.24);
      ctx.lineTo(s * 0.64, s * 0.26);
      ctx.lineTo(s * 0.54, s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.46, s * 0.5);
      ctx.lineTo(s * 0.58, s * 0.76);
      ctx.lineTo(s * 0.64, s * 0.74);
      ctx.lineTo(s * 0.54, s * 0.5);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    label: 'Horse',
    classIndex: 7,
    draw: (ctx, s) => {
      verticalGradient(ctx, s, [188, 212, 232], [214, 226, 236], 0, s * 0.62); // sky
      verticalGradient(ctx, s, [120, 158, 86], [78, 116, 54], s * 0.62, s); // field
      ctx.fillStyle = '#7a5230';
      // body
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.56, s * 0.22, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      // neck + head
      ctx.beginPath();
      ctx.moveTo(s * 0.66, s * 0.5);
      ctx.lineTo(s * 0.78, s * 0.32);
      ctx.lineTo(s * 0.84, s * 0.36);
      ctx.lineTo(s * 0.72, s * 0.54);
      ctx.closePath();
      ctx.fill();
      // legs
      ctx.fillRect(s * 0.4, s * 0.62, s * 0.04, s * 0.2);
      ctx.fillRect(s * 0.58, s * 0.62, s * 0.04, s * 0.2);
    },
  },
  {
    label: 'Automobile',
    classIndex: 1,
    draw: (ctx, s) => {
      verticalGradient(ctx, s, [206, 218, 230], [150, 162, 176], 0, s * 0.7); // background
      ctx.fillStyle = '#3b3f46';
      ctx.fillRect(0, s * 0.7, s, s * 0.3); // road
      // body
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.moveTo(s * 0.16, s * 0.62);
      ctx.lineTo(s * 0.3, s * 0.44);
      ctx.lineTo(s * 0.66, s * 0.44);
      ctx.lineTo(s * 0.84, s * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(s * 0.16, s * 0.58, s * 0.68, s * 0.1);
      // windows
      ctx.fillStyle = '#9fd0e6';
      ctx.fillRect(s * 0.34, s * 0.47, s * 0.26, s * 0.09);
      // wheels
      ctx.fillStyle = '#16181d';
      ctx.beginPath();
      ctx.arc(s * 0.32, s * 0.7, s * 0.07, 0, Math.PI * 2);
      ctx.arc(s * 0.66, s * 0.7, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];

/** Deterministically pick a sample index from a stable key (template/layout). */
export function pickCifarSampleIndex(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % CIFAR_SAMPLES.length;
}

/**
 * Render a sample to a canvas. When `grayscale` is set (1-channel inputs like
 * LeNet's `[N,1,32,32]`), the scene is desaturated so it matches the declared
 * tensor shape.
 */
export function renderCifarSampleCanvas(
  sample: CifarSample,
  size = 128,
  grayscale = false,
): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  sample.draw(ctx, size);

  // Subtle pixel-grid glow so it reads as a low-res tensor, not a photo.
  ctx.globalCompositeOperation = 'screen';
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const n = (x * 17 + y * 31) % 19;
      if (n !== 0 && n !== 7) continue;
      ctx.fillStyle = n === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(125,178,232,0.03)';
      ctx.fillRect(x, y, 4, 4);
    }
  }
  ctx.globalCompositeOperation = 'source-over';

  if (grayscale) {
    const image = ctx.getImageData(0, 0, size, size);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const lum = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = data[i + 1] = data[i + 2] = lum;
    }
    ctx.putImageData(image, 0, 0);
  }

  return canvas;
}

/**
 * Derive a normalized NxN grayscale matrix from a rendered sample canvas, used
 * as the Conv effect's "input map" so it matches the image flowing in.
 */
export function deriveSampleMatrix(canvas: HTMLCanvasElement, n = 8): number[][] {
  if (typeof document === 'undefined') return [];
  const small = document.createElement('canvas');
  small.width = n;
  small.height = n;
  const ctx = small.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(canvas, 0, 0, n, n);
  const data = ctx.getImageData(0, 0, n, n).data;

  const raw: number[][] = [];
  let min = Infinity;
  let max = -Infinity;
  for (let row = 0; row < n; row++) {
    const cells: number[] = [];
    for (let col = 0; col < n; col++) {
      const i = (row * n + col) * 4;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      cells.push(lum);
      if (lum < min) min = lum;
      if (lum > max) max = lum;
    }
    raw.push(cells);
  }
  const range = Math.max(max - min, 0.001);
  return raw.map((r) => r.map((v) => (v - min) / range));
}
