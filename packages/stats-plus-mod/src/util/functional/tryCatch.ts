export function tryCatch<TSuccess, TFailure>(
  func: () => TSuccess,
  fallback: (error: unknown) => TFailure,
): TSuccess | TFailure {
  try {
    return func();
  } catch (e) {
    return fallback(e);
  }
}
