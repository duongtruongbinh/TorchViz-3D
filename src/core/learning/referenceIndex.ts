export type LearningReferenceIdentity = { id: string };

export type IndexedLearningReferences<T extends LearningReferenceIdentity> = {
  ordered: T[];
  featuredCount: number;
  indexById: ReadonlyMap<string, number>;
};

export function indexLearningReferences<T extends LearningReferenceIdentity>(
  papers: readonly T[],
  featuredIds: readonly string[],
): IndexedLearningReferences<T> {
  const featuredSet = new Set(featuredIds);
  const featured = papers.filter((paper) => featuredSet.has(paper.id));
  const additional = papers.filter((paper) => !featuredSet.has(paper.id));
  const ordered = [...featured, ...additional];
  return {
    ordered,
    featuredCount: featured.length,
    indexById: new Map(ordered.map((paper, index) => [paper.id, index + 1])),
  };
}
