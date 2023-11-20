export interface MetadataValue {
  IS_HASHABLE: boolean;
  HASHABLES: ((instance: unknown) => unknown)[];
}
