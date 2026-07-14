import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { learningMdxSearchPlugin } from './scripts/learningContentMdx';
import { learningCatalog } from './src/content/learning/index.ts';

const require = createRequire(import.meta.url);
const configDir = path.dirname(fileURLToPath(import.meta.url));
const pyodideRoot = path.dirname(require.resolve('pyodide/pyodide.js'));
const monacoVsRoot = path.dirname(require.resolve('monaco-editor/min/vs/loader.js'));
const interFontSource = require.resolve('@fontsource/inter/files/inter-vietnamese-600-normal.woff');
const interFontFileName = path.basename(interFontSource);
const unicodeFontJson: Record<string, string> = {
  'codepoint-index/plane0/0-ff.json': '[1,{".*":{"latin":"oooooooooooooooooooooooooooooooooooooooooo?"}}]',
  'codepoint-index/plane0/100-1ff.json': '[1,{".*":{"vietnamese":"<0`000`0000000000<00000000`006","latin-ext":"oooooooooooooooooooooooooooooooooooooooooo?","latin":"0000000020000`"}}]',
  'codepoint-index/plane0/300-3ff.json': '[1,{".*":{"vietnamese":"K<000PP","latin-ext":"K<000PP","latin":"K<000PP"}}]',
  'codepoint-index/plane0/1e00-1eff.json': '[1,{".*":{"vietnamese":"00000000000000000000000000`oooooooooooooo?","latin-ext":"oooooooooooooooooooooooooooooooooooooooooo?"}}]',
  'font-meta/latin.json': '[1,{"id":"latin","ranges":"0-FF,131,152-153,2BB-2BC,2C6,2DA,2DC,300-301,303-304,308-309,323,329,2000-206F,2074,20AC,2122,2191,2193,2212,2215,FEFF,FFFD","typeforms":{"sans-serif":{"normal":[100,200,300,400,500,600,700,800,900]},"monospace":{"normal":[400]},"serif":{"normal":[400]}}}]',
  'font-meta/latin-ext.json': '[1,{"id":"latin-ext","ranges":"100-2AF,300-301,303-304,308-309,323,329,1E00-1EFF,2020,20A0-20AB,20AD-20CF,2113,2C60-2C7F,A720-A7FF","typeforms":{"sans-serif":{"normal":[100,200,300,400,500,600,700,800,900]},"monospace":{"normal":[400]},"serif":{"normal":[400]}}}]',
  'font-meta/vietnamese.json': '[1,{"id":"vietnamese","ranges":"102-103,110-111,128-129,168-169,1A0-1A1,1AF-1B0,300-301,303-304,308-309,323,329,1EA0-1EF9,20AB","typeforms":{"sans-serif":{"normal":[100,200,300,400,500,600,700,800,900]},"monospace":{"normal":[400]},"serif":{"normal":[400]}}}]',
};
const unicodeFontFamilies = ['latin', 'latin-ext', 'vietnamese'] as const;
const unicodeFontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const pyodideFiles = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

function contentType(fileName: string): string {
  if (fileName.endsWith('.js')) return 'text/javascript';
  if (fileName.endsWith('.wasm')) return 'application/wasm';
  if (fileName.endsWith('.zip')) return 'application/zip';
  if (fileName.endsWith('.json')) return 'application/json';
  if (fileName.endsWith('.css')) return 'text/css';
  if (fileName.endsWith('.html')) return 'text/html';
  if (fileName.endsWith('.woff')) return 'font/woff';
  if (fileName.endsWith('.ttf')) return 'font/ttf';
  if (fileName.endsWith('.map')) return 'application/json';
  return 'application/octet-stream';
}

function copyDirectory(sourceDir: string, targetDir: string): void {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(source, target);
    } else if (entry.isFile()) {
      fs.copyFileSync(source, target);
    }
  }
}

function getUnicodeFontSource(family: string, weight: string): string | null {
  if (!unicodeFontFamilies.includes(family as (typeof unicodeFontFamilies)[number])) return null;
  if (!unicodeFontWeights.includes(Number(weight) as (typeof unicodeFontWeights)[number])) return null;
  return require.resolve(`@fontsource/inter/files/inter-${family}-${weight}-normal.woff`);
}

function resolveUnicodeFontAsset(relativePath: string): { contentType: string; body?: string; filePath?: string } | null {
  const json = unicodeFontJson[relativePath];
  if (json) return { contentType: 'application/json', body: json };

  const match = relativePath.match(/^font-files\/(latin|latin-ext|vietnamese)\/sans-serif\.normal\.(\d+)\.woff$/);
  if (!match) return null;

  const filePath = getUnicodeFontSource(match[1], match[2]);
  return filePath ? { contentType: 'font/woff', filePath } : null;
}

function writeUnicodeFontAssets(outDir: string): void {
  const unicodeRoot = path.join(outDir, 'unicode-fonts');
  for (const [relativePath, body] of Object.entries(unicodeFontJson)) {
    const targetPath = path.join(unicodeRoot, relativePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, body);
  }

  for (const family of unicodeFontFamilies) {
    for (const weight of unicodeFontWeights) {
      const source = getUnicodeFontSource(family, String(weight));
      if (!source) continue;
      const targetPath = path.join(unicodeRoot, 'font-files', family, `sans-serif.normal.${weight}.woff`);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(source, targetPath);
    }
  }
}

function resolveServedFile(rootDir: string, requestPath: string, prefix: string): string | null {
  const relativePath = decodeURIComponent(requestPath.slice(prefix.length));
  const filePath = path.resolve(rootDir, relativePath);
  if (!filePath.startsWith(`${rootDir}${path.sep}`)) return null;
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
  return filePath;
}

function pyodideAssetsPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'torchviz-pyodide-assets',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const requestPath = request.url?.split('?')[0] ?? '';
        if (requestPath.startsWith('/unicode-fonts/')) {
          const relativePath = decodeURIComponent(requestPath.slice('/unicode-fonts/'.length));
          const asset = resolveUnicodeFontAsset(relativePath);
          if (asset?.body) {
            response.setHeader('Content-Type', asset.contentType);
            response.end(asset.body);
            return;
          }
          if (asset?.filePath) {
            response.setHeader('Content-Type', asset.contentType);
            fs.createReadStream(asset.filePath).pipe(response);
            return;
          }
          response.statusCode = 404;
          response.end('Unicode font asset not found');
          return;
        }

        const monacoFile = requestPath.startsWith('/monaco/vs/')
          ? resolveServedFile(monacoVsRoot, requestPath, '/monaco/vs/')
          : null;
        if (monacoFile) {
          response.setHeader('Content-Type', contentType(monacoFile));
          fs.createReadStream(monacoFile).pipe(response);
          return;
        }

        if (!requestPath.startsWith('/pyodide/')) {
          if (requestPath === `/fonts/${interFontFileName}`) {
            response.setHeader('Content-Type', contentType(interFontFileName));
            fs.createReadStream(interFontSource).pipe(response);
            return;
          }
          next();
          return;
        }

        const fileName = path.basename(requestPath);
        if (!pyodideFiles.includes(fileName)) {
          response.statusCode = 404;
          response.end('Pyodide asset not found');
          return;
        }

        response.setHeader('Content-Type', contentType(fileName));
        fs.createReadStream(path.join(pyodideRoot, fileName)).pipe(response);
      });
    },
    writeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const targetDir = path.join(outDir, 'pyodide');
      fs.mkdirSync(targetDir, { recursive: true });
      for (const fileName of pyodideFiles) {
        fs.copyFileSync(path.join(pyodideRoot, fileName), path.join(targetDir, fileName));
      }
      const fontTargetDir = path.join(outDir, 'fonts');
      fs.mkdirSync(fontTargetDir, { recursive: true });
      fs.copyFileSync(interFontSource, path.join(fontTargetDir, interFontFileName));
      writeUnicodeFontAssets(outDir);
      copyDirectory(monacoVsRoot, path.join(outDir, 'monaco', 'vs'));
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    learningMdxSearchPlugin(path.join(configDir, 'src/content/learning'), learningCatalog),
    mdx(),
    react(),
    pyodideAssetsPlugin(),
  ],
  resolve: {
    alias: {
      '@': configDir,
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'monaco-vendor': ['@monaco-editor/react'],
        },
      },
    },
  },
});
