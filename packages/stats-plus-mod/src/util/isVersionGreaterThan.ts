export function isVersionGreaterThan(version: string, than: string): boolean {
  const firstSegments = version.split(".").map((segment) => parseInt(segment, 10));
  const secondSegments = than.split(".").map((segment) => parseInt(segment, 10));

  return (
    firstSegments.every((segment, idx) => segment >= (secondSegments[idx] ?? 0))
    && firstSegments.some((segment, idx) => segment > (secondSegments[idx] ?? 0))
  );
}
