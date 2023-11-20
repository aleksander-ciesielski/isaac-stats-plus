import type { ProviderStateConfigDTO } from "~/types/config/dto/providerState/ProviderStateConfigDTO";
import { ProviderStateConfigDTOValidator } from "~/validators/dto/config/ProviderStateConfigDTOValidator";

function createProviderStateConfigDTOValidator(): ProviderStateConfigDTOValidator {
  return new ProviderStateConfigDTOValidator();
}

describe("ProviderStateConfigDTOValidator", () => {
  describe("validate", () => {
    it("returns unchanged ProviderStateConfigDTO if it is is valid.", () => {
      const providerStateConfigDTOValidator = createProviderStateConfigDTOValidator();
      const providerStateConfigDTO = {
        state: [
          {
            state: {
              foo: "bar",
            },
            ref: {
              addon: "some-addon-id",
              id: "some-state-id",
            },
          },
          {
            state: {
              hello: "world",
            },
            ref: {
              addon: "some-addon-id",
              id: "some-state-id",
            },
          },
        ],
      } satisfies ProviderStateConfigDTO;

      expect(providerStateConfigDTOValidator.validate(providerStateConfigDTO)).toEqual(providerStateConfigDTO);
    });

    it.each([
      undefined,
      0,
      "abc",
      [],
      {},
    ])("returns an empty ProviderStateConfigDTO if the given one is invalid.", (providerStateConfigDTO) => {
      const providerStateConfigDTOValidator = createProviderStateConfigDTOValidator();

      // @ts-expect-error
      expect(providerStateConfigDTOValidator.validate(providerStateConfigDTO)).toEqual({ state: [] });
    });

    it("filters state entries that are not an object.", () => {
      const providerStateConfigDTOValidator = createProviderStateConfigDTOValidator();
      const providerStateConfigDTO = {
        state: [
          // @ts-expect-error
          123,
        ],
      } satisfies ProviderStateConfigDTO;

      // @ts-expect-error
      expect(providerStateConfigDTOValidator.validate(providerStateConfigDTO)).toEqual({ state: [] });
    });

    it("filters state entries that have an invalid extension ref.", () => {
      const providerStateConfigDTOValidator = createProviderStateConfigDTOValidator();
      const providerStateConfigDTO = {
        state: [
          {
            state: {},
            // @ts-expect-error
            ref: 123,
          },
        ],
      } satisfies ProviderStateConfigDTO;

      // @ts-expect-error
      expect(providerStateConfigDTOValidator.validate(providerStateConfigDTO)).toEqual({ state: [] });
    });

    it("filters state entries that have state that is not an object literal.", () => {
      const providerStateConfigDTOValidator = createProviderStateConfigDTOValidator();
      const providerStateConfigDTO = {
        state: [
          {
            // @ts-expect-error
            state: 123,
            ref: {
              addon: "some-addon-id",
              id: "some-state-id",
            },
          },
          {
            // @ts-expect-error
            state: [],
            ref: {
              addon: "some-addon-id",
              id: "some-state-id",
            },
          },
        ],
      } satisfies ProviderStateConfigDTO;

      // @ts-expect-error
      expect(providerStateConfigDTOValidator.validate(providerStateConfigDTO)).toEqual({ state: [] });
    });
  });
});
