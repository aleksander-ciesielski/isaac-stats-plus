import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { ProviderStateConfigDTO } from "~/types/config/dto/providerState/ProviderStateConfigDTO";
import type { ProviderStateConfigEntryDTO } from "~/types/config/dto/providerState/ProviderStateConfigEntryDTO";
import { isExtensionRef } from "~/util/validation/isExtensionRef";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Logger } from "~/Logger";

@Singleton()
export class ProviderStateConfigDTOValidator {
  private readonly logger = Logger.for(ProviderStateConfigDTOValidator.name);

  public validate(state: Unvalidated<ProviderStateConfigDTO>): ProviderStateConfigDTO {
    if (state === undefined || !Array.isArray(state.state)) {
      this.logger.warn("Expected provider state to be an array.");
      return { state: [] };
    }

    return {
      state: state.state
        .map((entry) => this.validateEntry(entry))
        .filter((entry) => entry !== undefined) as ProviderStateConfigEntryDTO[],
    };
  }

  private validateEntry(
    entry: Unvalidated<ProviderStateConfigEntryDTO>,
  ): ProviderStateConfigEntryDTO | undefined {
    if (typeof entry !== "object") {
      this.logger.warn("Expected provider state entry to be an object.");
      return;
    }

    if (!isExtensionRef(entry.ref)) {
      this.logger.warn("Expected entry ref to be a valid extension ref object.");
      return;
    }

    if (entry.state === undefined || typeof entry.state !== "object" || Array.isArray(entry.state)) {
      this.logger.warn("Expected entry state to be an object.");
      return;
    }

    return {
      ref: entry.ref,
      state: entry.state as Record<string, string>,
    };
  }
}
