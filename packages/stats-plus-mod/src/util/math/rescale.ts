import type { Tuple } from "~/util/types/Tuple";

export function rescale(
  value: number,
  [inMin, inMax]: Tuple<2, number>,
  [outMin, outMax]: Tuple<2, number>,
): number {
  return outMin + ((outMax - outMin) / (inMax - inMin)) * (value - inMin);
}
