import { toFixed } from "~/util/toFixed";

describe("toFixed", () => {
  it("truncates the given number to keep n decimal places.", () => {
    expect(toFixed(7.43, 1)).toBe(7.4);
    expect(toFixed(7.48, 1)).toBe(7.4);
    expect(toFixed(1.435, 2)).toBe(1.43);
    expect(toFixed(50, 8)).toBe(50);
    expect(toFixed(99.999, 0)).toBe(99);
    expect(toFixed(14.659317, 4)).toBe(14.6593);
    expect(toFixed(-5.4, 0)).toBe(-5);
    expect(toFixed(-5.6, 0)).toBe(-5);
    expect(toFixed(Infinity, 4)).toBe(Infinity);
    expect(toFixed(-Infinity, 0)).toBe(-Infinity);
  });
});
