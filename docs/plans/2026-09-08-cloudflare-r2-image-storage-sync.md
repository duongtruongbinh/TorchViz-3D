# Cloudflare R2 Image Storage & Sync Plan

Date: 2026-09-08
Status: Proposed

## Context & Motivation

The repository currently stores approximately 122MB of educational image assets under `src/assets/learning/`. While functional, storing binary assets in git increases repository clone size, bloats commit history, and increases Vite build times.

Cloudflare R2 provides an S3-compatible, zero-egress-fee object storage solution with seamless Cloudflare CDN distribution.

## Scope & Objectives

1. **Incremental Sync Script (`scripts/syncR2Assets.ts`)**:
   - Provide a fast, automated CLI tool to upload images from `src/assets/learning/` to Cloudflare R2 using standard S3 API (`@aws-sdk/client-s3`).
   - Incremental logic: compares local file size / ETag against remote bucket to avoid redundant uploads.
   - Sets appropriate `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`.
   - Supports `--dry-run`, `--force`, and `--prefix` flags.

2. **Application CDN Integration**:
   - Update `LessonImage` in `src/components/learning/learningMdxComponents.tsx` to support `VITE_ASSETS_CDN_URL`.
   - If configured, serve images directly from Cloudflare R2 / CDN URL.
   - If not configured, gracefully fallback to local Vite `import.meta.glob` loaders.

3. **Configuration & Documentation**:
   - Provide `.env.example` with required R2 environment variables.
   - Add documentation at `docs/reference/cloudflare-r2-asset-storage.md` explaining R2 bucket setup, API token generation, custom domain binding, and sync operations.
