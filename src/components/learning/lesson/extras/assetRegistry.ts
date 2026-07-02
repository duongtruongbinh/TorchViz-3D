const learningAssetUrls: Record<string, string> = {
  'llm-from-scratch-roadmap.ai-hierarchy': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-ai-hierarchy.png', import.meta.url).href,
  'llm-from-scratch-roadmap.next-token-loop': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-next-token-loop.png', import.meta.url).href,
};

export function getLearningAssetUrl(assetId: string): string {
  return learningAssetUrls[assetId] ?? assetId;
}
