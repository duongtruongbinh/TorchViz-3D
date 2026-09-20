export function prepareCodeBlockCopySource(source: string, isOutput: boolean): string {
  if (!isOutput) return source;
  return source.replace(/==([^\n]+?)==/g, '$1');
}
