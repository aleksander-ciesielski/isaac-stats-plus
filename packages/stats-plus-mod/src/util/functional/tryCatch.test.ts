import { vi } from "vitest";
import { tryCatch } from "~/util/functional/tryCatch";

describe("tryCatch", () => {
  it("executes the given function and returns its result.", () => {
    const fn = vi.fn(() => "A");
    const fallbackFn = vi.fn(() => "B");

    const result = tryCatch(fn, fallbackFn);

    expect(result).toBe("A");
    expect(fn).toBeCalledTimes(1);
    expect(fallbackFn).toBeCalledTimes(0);
  });

  it("executes the fallback function and returns its result if the first one throws.", () => {
    const fn = vi.fn(() => { throw new Error(); });
    const fallbackFn = vi.fn(() => "B");

    const result = tryCatch(fn, fallbackFn);

    expect(result).toBe("B");
    expect(fn).toBeCalledTimes(1);
    expect(fallbackFn).toBeCalledTimes(1);
  });

  it("throws an error if the fallback function throws.", () => {
    const err = new Error();

    const fn = vi.fn(() => { throw new Error(); });
    const fallbackFn = vi.fn(() => { throw err; });

    expect(() => tryCatch(fn, fallbackFn)).toThrow(err);
  });
});
