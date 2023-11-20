export function* mapIterator<TValue, TMappedValue>(
  iterator: IterableIterator<TValue>,
  mapper: (value: TValue) => TMappedValue,
): IterableIterator<TMappedValue> {
  // eslint-disable-next-line no-restricted-syntax
  for (const element of iterator) {
    yield mapper(element);
  }
}
