import { isExtensionRef } from "~/util/validation/isExtensionRef";

describe("isExtensionRef", () => {
  it.each([
    [1, false],
    ["abc", false],
    [undefined, false],
    [false, false],
    [[], false],
    [{}, false],
    [{ addon: "some-addon-id" }, false],
    [{ id: "some-ref-id" }, false],
    [{ addon: "some-addon-id", id: "some-ref-id" }, true],
  ])("returns a boolean indicating if the given value is an ExtensionRef.", (ref, expectedOutcome) => {
    expect(isExtensionRef(ref)).toBe(expectedOutcome);
  });
});
