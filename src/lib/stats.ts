import { IRGraph } from "./irTypes";

export function formatNumber(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toString();
}

export function formatMemory(mb: number): string {
  if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
  return mb.toFixed(2) + " MB";
}
