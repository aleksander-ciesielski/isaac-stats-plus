import { toFixedFormatted } from "~/util/toFixedFormatted";

describe("toFixedFormattec", () => {
  it("truncates the given number to keep n decimal places.", () => {
    expect(toFixedFormatted(7.43, 1)).toBe("7.4");
    expect(toFixedFormatted(7.48, 1)).toBe("7.4");
    expect(toFixedFormatted(1.435, 2)).toBe("1.43");
    expect(toFixedFormatted(50, 8)).toBe("50.00000000");
    expect(toFixedFormatted(99.999, 0)).toBe("99");
    expect(toFixedFormatted(14.659317, 4)).toBe("14.6593");
    expect(toFixedFormatted(-5.4, 0)).toBe("-5");
    expect(toFixedFormatted(-5.6, 0)).toBe("-5");
  });
});
