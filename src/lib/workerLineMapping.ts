export function countPythonPreambleLines(preamble: string): number {
  if (!preamble) return 0;
  return preamble.split('\n').length - 1;
}

export function mapWrappedPythonLineToUserLine(wrappedLine: number, preambleLineCount: number): number {
  return Math.max(1, wrappedLine - preambleLineCount);
}
