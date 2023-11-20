import { rescale } from "~/util/math/rescale";

describe("rescale", () => {
  it("maps the given value to new boundaries.", () => {
    expect(rescale(5, [0, 10], [0, 1])).toBe(0.5);
    expect(rescale(0.5, [0, 1], [0, 10])).toBe(5);
    expect(rescale(30, [15, 30], [100, 1_000])).toBe(1_000);
    expect(rescale(12_345, [0, 100_000], [0, 1])).toBe(0.12345);
  });
});
