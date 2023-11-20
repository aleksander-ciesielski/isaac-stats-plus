import type { MetadataValue } from "~/types/MetadataValue";

export type DefaultMetadataValues = {
  [K in keyof MetadataValue]: () => MetadataValue[K];
};
