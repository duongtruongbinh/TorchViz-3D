import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

// Load .env if present without needing external packages
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    try {
      const content = readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // Ignore reading errors
    }
  }
}

loadEnv();

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getLocalFiles(dir: string): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;

  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (MIME_TYPES[ext]) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

interface SyncOptions {
  dryRun: boolean;
  force: boolean;
  prefix: string;
  sourceDir: string;
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2);
  const options: SyncOptions = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    prefix: 'assets/learning/',
    sourceDir: 'src/assets/learning',
  };

  for (const arg of args) {
    if (arg.startsWith('--prefix=')) {
      options.prefix = arg.slice('--prefix='.length).replace(/^\/+/, '');
      if (options.prefix && !options.prefix.endsWith('/')) {
        options.prefix += '/';
      }
    } else if (arg.startsWith('--source=')) {
      options.sourceDir = arg.slice('--source='.length);
    }
  }

  return options;
}

async function fetchRemoteObjects(
  s3: S3Client,
  bucket: string,
  prefix: string,
): Promise<Map<string, { size: number; etag?: string }>> {
  const map = new Map<string, { size: number; etag?: string }>();
  let continuationToken: string | undefined;

  process.stdout.write(`Fetching existing remote objects from bucket '${bucket}'... `);
  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });
    const response = await s3.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Size !== undefined) {
          map.set(obj.Key, { size: obj.Size, etag: obj.ETag });
        }
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`found ${map.size} existing items.`);
  return map;
}

async function runPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const curIndex = index++;
      results[curIndex] = await fn(items[curIndex], curIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const options = parseArgs();
  console.log('='.repeat(60));
  console.log(' Cloudflare R2 Asset Sync');
  console.log('='.repeat(60));
  console.log(`Source directory: ${options.sourceDir}`);
  console.log(`Destination prefix: ${options.prefix}`);
  console.log(`Dry-run mode: ${options.dryRun ? 'ENABLED (no uploads will be made)' : 'OFF'}`);
  console.log(`Force overwrite: ${options.force ? 'ENABLED' : 'OFF'}`);
  console.log('-'.repeat(60));

  const localFiles = getLocalFiles(resolve(process.cwd(), options.sourceDir));
  if (localFiles.length === 0) {
    console.log(`No image assets found in ${options.sourceDir}. Exiting.`);
    return;
  }

  const totalBytes = localFiles.reduce((acc, file) => acc + statSync(file).size, 0);
  console.log(`Found ${localFiles.length} local files totaling ${formatBytes(totalBytes)}.`);

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const endpoint =
    process.env.R2_ENDPOINT?.trim() ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

  if ((!accountId && !endpoint) || !accessKeyId || !secretAccessKey || !bucket) {
    if (options.dryRun) {
      console.warn('\n[Notice] R2 credentials not fully set in environment or .env.');
      console.warn('Dry-run will list the planned upload actions based on local files only.\n');
      for (const file of localFiles.slice(0, 15)) {
        const rel = relative(resolve(process.cwd(), options.sourceDir), file).replace(/\\/g, '/');
        const key = `${options.prefix}${rel}`;
        const size = statSync(file).size;
        console.log(`  [DRY-RUN UPLOAD] ${key} (${formatBytes(size)})`);
      }
      if (localFiles.length > 15) {
        console.log(`  ... and ${localFiles.length - 15} more files.`);
      }
      console.log('\nDry-run completed. Configure .env to test actual R2 connection.');
      return;
    }

    console.error('\nError: Missing required Cloudflare R2 credentials in environment.');
    console.error('Please configure the following in .env or environment variables:');
    console.error('  - CLOUDFLARE_ACCOUNT_ID (or R2_ENDPOINT)');
    console.error('  - R2_ACCESS_KEY_ID');
    console.error('  - R2_SECRET_ACCESS_KEY');
    console.error('  - R2_BUCKET_NAME');
    process.exit(1);
  }

  console.log(`Endpoint: ${endpoint}`);

  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  let remoteObjects = new Map<string, { size: number; etag?: string }>();
  try {
    remoteObjects = await fetchRemoteObjects(s3, bucket, options.prefix);
  } catch (err) {
    console.error('\nFailed to connect to Cloudflare R2 bucket:');
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  const plannedUploads: Array<{
    filePath: string;
    key: string;
    size: number;
    mime: string;
  }> = [];

  let skippedCount = 0;
  let skippedBytes = 0;

  for (const file of localFiles) {
    const rel = relative(resolve(process.cwd(), options.sourceDir), file).replace(/\\/g, '/');
    const key = `${options.prefix}${rel}`;
    const size = statSync(file).size;
    const ext = extname(file).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    const remote = remoteObjects.get(key);
    if (!options.force && remote && remote.size === size) {
      skippedCount++;
      skippedBytes += size;
    } else {
      plannedUploads.push({ filePath: file, key, size, mime });
    }
  }

  console.log(`\nSync Analysis:`);
  console.log(`  Up-to-date (skipped): ${skippedCount} files (${formatBytes(skippedBytes)})`);
  console.log(
    `  To upload:            ${plannedUploads.length} files (${formatBytes(
      plannedUploads.reduce((a, b) => a + b.size, 0),
    )})`,
  );

  if (plannedUploads.length === 0) {
    console.log('\nAll assets are already synced with Cloudflare R2. Nothing to do!');
    return;
  }

  if (options.dryRun) {
    console.log('\n[DRY-RUN] Files that would be uploaded:');
    for (const item of plannedUploads.slice(0, 20)) {
      console.log(`  + ${item.key} (${formatBytes(item.size)}, ${item.mime})`);
    }
    if (plannedUploads.length > 20) {
      console.log(`  ... and ${plannedUploads.length - 20} more files.`);
    }
    console.log('\nDry-run completed successfully.');
    return;
  }

  console.log(`\nUploading ${plannedUploads.length} files to R2 (concurrency: 8)...`);
  const startTime = Date.now();
  let uploadedCount = 0;
  let errorCount = 0;

  await runPool(plannedUploads, 8, async (item) => {
    try {
      const body = readFileSync(item.filePath);
      const putCmd = new PutObjectCommand({
        Bucket: bucket,
        Key: item.key,
        Body: body,
        ContentType: item.mime,
        CacheControl: 'public, max-age=31536000, immutable',
      });
      await s3.send(putCmd);
      uploadedCount++;
      process.stdout.write(
        `\r[${uploadedCount}/${plannedUploads.length}] Uploaded: ${item.key} (${formatBytes(item.size)})`,
      );
    } catch (err) {
      errorCount++;
      console.error(`\nFailed to upload ${item.key}:`, err instanceof Error ? err.message : err);
    }
  });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n\n' + '='.repeat(60));
  console.log(` Sync Completed in ${durationSec}s`);
  console.log(` Uploaded: ${uploadedCount} | Errors: ${errorCount} | Skipped: ${skippedCount}`);
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
