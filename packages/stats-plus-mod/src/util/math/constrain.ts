export function constrain(
  value: number,
  [min, max]: [min: number, max: number],
): number {
  return Math.min(max, Math.max(min, value));
}
