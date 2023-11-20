import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export interface ProviderStateConfigEntryDTO {
  ref: StatsPlusAPI.ExtensionRef;
  state: Record<string, string>;
}
