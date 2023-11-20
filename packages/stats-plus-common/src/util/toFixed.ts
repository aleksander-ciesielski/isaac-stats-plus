export function toFixed(value: number, digits: number): number {
  const EPSILON = 1e-8;

  // TSTL does not support Math.trunc.
  return (value > 0)
    ? Math.floor(value * 10 ** digits + EPSILON) / 10 ** digits
    : Math.ceil(value * 10 ** digits + EPSILON) / 10 ** digits;
}
