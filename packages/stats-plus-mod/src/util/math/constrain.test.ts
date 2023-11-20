import { constrain } from "~/util/math/constrain";

describe("constrain", () => {
  it("constrains the given value between the given boundaries.", () => {
    expect(constrain(25, [0, 100])).toBe(25);
    expect(constrain(8, [3, 5])).toBe(5);
    expect(constrain(40, [70, 100])).toBe(70);
    expect(constrain(-5, [0, 1])).toBe(0);
    expect(constrain(-1, [-50, -30])).toBe(-30);
  });
});
