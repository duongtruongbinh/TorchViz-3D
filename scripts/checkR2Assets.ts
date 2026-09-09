/**
 * checkR2Assets.ts
 *
 * Scans all MDX lesson files for <LessonImage assetPath="..." /> references and
 * verifies that each image is accessible on the Cloudflare R2 CDN via an HTTP
 * HEAD request.
 *
 * No write credentials needed — uses only the public R2_PUBLIC_URL or
 * ASSETS_CDN_URL env var.
 *
 * Usage:
 *   npm run check:r2-assets
 *   node scripts/checkR2Assets.ts [--verbose]
 *
 * Exit codes:
 *   0 — all images are reachable
 *   1 — one or more images are missing or unreachable
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

// ---------------------------------------------------------------------------
// Load .env (same inline loader as syncR2Assets.ts, no external deps)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const verbose = process.argv.includes('--verbose');
const contentRoot = resolve(process.cwd(), 'src/content/learning');
const cdnBase = (
  process.env.ASSETS_CDN_URL ??
  process.env.R2_PUBLIC_URL ??
  ''
).trim().replace(/\/+$/, '');

if (!cdnBase) {
  console.error(
    '\n[checkR2Assets] Error: ASSETS_CDN_URL (or R2_PUBLIC_URL) is not set.\n' +
    'Set it in your .env file or environment to run this check.\n',
  );
  process.exit(1);
}

console.log(`\n🔍  Checking lesson image assets against CDN: ${cdnBase}\n`);

// ---------------------------------------------------------------------------
// Collect all MDX files
// ---------------------------------------------------------------------------
function collectMdxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Extract assetPath values from MDX content
// ---------------------------------------------------------------------------
const ASSET_PATH_RE = /assetPath=["']([^"']+)["']/g;

function extractAssetPaths(content: string): string[] {
  const paths: string[] = [];
  ASSET_PATH_RE.lastIndex = 0;
  let match = ASSET_PATH_RE.exec(content);
  while (match !== null) {
    paths.push(match[1]);
    match = ASSET_PATH_RE.exec(content);
  }
  return paths;
}

// ---------------------------------------------------------------------------
// Build a de-duped map: assetPath → list of referencing MDX files
// ---------------------------------------------------------------------------
const mdxFiles = collectMdxFiles(contentRoot);
const assetToMdxFiles = new Map<string, string[]>();

for (const mdxFile of mdxFiles) {
  const content = readFileSync(mdxFile, 'utf-8');
  const paths = extractAssetPaths(content);
  for (const p of paths) {
    const clean = p.replace(/^\/+/, '').replace(/^assets\/learning\//, '');
    const refs = assetToMdxFiles.get(clean) ?? [];
    refs.push(relative(process.cwd(), mdxFile));
    assetToMdxFiles.set(clean, refs);
  }
}

const uniqueAssets = [...assetToMdxFiles.keys()];
console.log(`Found ${uniqueAssets.length} unique image references across ${mdxFiles.length} MDX files.\n`);

// ---------------------------------------------------------------------------
// HTTP HEAD check (Node 18+ built-in fetch)
// ---------------------------------------------------------------------------
async function headCheck(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { ok: response.ok, status: response.status };
  } catch (err) {
    return { ok: false, status: 0 };
  }
}

// ---------------------------------------------------------------------------
// Run checks with bounded concurrency
// ---------------------------------------------------------------------------
async function runPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

interface CheckResult {
  assetPath: string;
  url: string;
  ok: boolean;
  status: number;
  refs: string[];
}

async function main() {
  const results = await runPool<string, CheckResult>(uniqueAssets, 12, async (assetPath) => {
    const url = `${cdnBase}/assets/learning/${assetPath}`;
    const { ok, status } = await headCheck(url);
    if (verbose && ok) {
      process.stdout.write(`  ✓ ${assetPath}\n`);
    }
    return { assetPath, url, ok, status, refs: assetToMdxFiles.get(assetPath) ?? [] };
  });

  const missing = results.filter((r) => !r.ok);
  const ok = results.filter((r) => r.ok);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ✓ Reachable:  ${ok.length} images`);
  console.log(`  ✗ Missing:    ${missing.length} images`);
  console.log(`${'─'.repeat(60)}\n`);

  if (missing.length > 0) {
    console.error('The following images are NOT accessible on the CDN:\n');
    for (const { assetPath, url, status, refs } of missing) {
      console.error(`  ✗ ${assetPath}`);
      console.error(`      URL:    ${url}`);
      console.error(`      Status: ${status === 0 ? 'network error' : status}`);
      console.error(`      Used in:`);
      for (const ref of refs) {
        console.error(`        - ${ref}`);
      }
      console.error('');
    }
    console.error(
      '💡 Fix: run `npm run sync:r2` to upload missing images to Cloudflare R2.\n',
    );
    process.exit(1);
  }

  console.log('✅  All lesson images are accessible on the CDN.\n');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
