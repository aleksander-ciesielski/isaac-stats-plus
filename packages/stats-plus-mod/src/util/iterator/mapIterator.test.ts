import { mapIterator } from "~/util/iterator/mapIterator";

describe("mapIterator", () => {
  it("returns a new iterator that yields values transformed by a given function.", () => {
    function* iterator(): IterableIterator<number> {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    }

    const iteratorSquared = mapIterator(iterator(), (x) => x ** 2);

    expect(Array.from(iteratorSquared)).toEqual([1, 4, 9, 16, 25]);
  });
});
