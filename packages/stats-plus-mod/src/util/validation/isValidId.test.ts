import { isValidId } from "~/util/validation/isValidId";

describe("isValidId", () => {
  it.each([
    ["", false],
    ["id_with_underscores", false],
    ["IdWithUppercaseLetters", false],
    ["id-with-hyphens", true],
    ["id-with-numbers-0123456789", true],
  ])("returns a boolean indicating if the given string is a valid id.", (id, expectedOutcome) => {
    expect(isValidId(id)).toBe(expectedOutcome);
  });
});
