import path from 'node:path';
import type { Plugin } from 'vite';

import { getLearningHomeDomainSummaries } from '../src/core/learning/selectors.ts';
import type { LearningCatalog } from '../src/core/learning/types.ts';

export function isLearningTableOfContentsFile(filePath: string, contentRoot: string): boolean {
  const normalizedPath = path.resolve(filePath);
  const normalizedRoot = path.resolve(contentRoot);
  return normalizedPath.startsWith(`${normalizedRoot}${path.sep}`)
    && path.basename(normalizedPath) === 'table-of-contents.ts';
}

export function learningHomeCatalogPlugin(catalog: LearningCatalog, contentRoot: string): Plugin {
  const virtualId = 'virtual:learning-home-catalog';
  const resolvedId = `\0${virtualId}`;

  return {
    name: 'torchviz-learning-home-catalog',
    configureServer(server) {
      let isRestarting = false;
      const restartForTocChange = (filePath: string) => {
        if (!isLearningTableOfContentsFile(filePath, contentRoot) || isRestarting) return;
        isRestarting = true;
        void server.restart();
      };
      server.watcher.add(contentRoot);
      server.watcher.on('add', restartForTocChange);
      server.watcher.on('unlink', restartForTocChange);
      return () => {
        server.watcher.off('add', restartForTocChange);
        server.watcher.off('unlink', restartForTocChange);
      };
    },
    handleHotUpdate(context) {
      if (!isLearningTableOfContentsFile(context.file, contentRoot)) return undefined;
      void context.server.restart();
      return [];
    },
    resolveId(id) {
      return id === virtualId ? resolvedId : null;
    },
    load(id) {
      if (id !== resolvedId) return null;
      return `export default ${JSON.stringify(getLearningHomeDomainSummaries(catalog))};`;
    },
  };
}
