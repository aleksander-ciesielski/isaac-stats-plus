export function debounce<TArgs extends unknown[]>(
  delayMs: number,
  fn: (...args: TArgs) => void,
): (...args: TArgs) => void {
  const MS_PER_FRAME = (1000 / 30);

  let previous = -Infinity;

  return (...args) => {
    const current = Game().GetFrameCount();
    const elapsedMs = (current - previous) * MS_PER_FRAME;

    if (delayMs > elapsedMs) {
      return;
    }

    previous = current;
    fn(...args);
  };
}
