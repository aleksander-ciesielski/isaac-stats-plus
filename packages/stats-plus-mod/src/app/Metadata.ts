import type { MetadataValue } from "~/types/MetadataValue";
import type { DependencyIdentifier } from "~/app/ioc/dependency/DependencyIdentifier";
import type { DefaultMetadataValues } from "~/types/DefaultMetadataValues";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Metadata {
  private static readonly DEFAULT_METADATA_VALUES: DefaultMetadataValues = {
    IS_HASHABLE: () => false,
    HASHABLES: () => [],
  };

  private static readonly STORAGE = new Map<DependencyIdentifier, Partial<MetadataValue>>();

  public static setMetadata<TMetadataKey extends keyof MetadataValue>(
    identifier: DependencyIdentifier,
    key: TMetadataKey,
    value: MetadataValue[TMetadataKey],
  ): void {
    if (!Metadata.STORAGE.has(identifier)) {
      Metadata.STORAGE.set(identifier, {});
    }

    const dependencyMetadata = Metadata.STORAGE.get(identifier)!;
    dependencyMetadata[key] = value;
  }

  public static getMetadata<TMetadataKey extends keyof MetadataValue>(
    identifier: DependencyIdentifier,
    key: TMetadataKey,
  ): MetadataValue[TMetadataKey] {
    if (!Metadata.STORAGE.has(identifier)) {
      Metadata.STORAGE.set(identifier, {});
    }

    const dependencyMetadata = Metadata.STORAGE.get(identifier)!;
    dependencyMetadata[key] ??= Metadata.DEFAULT_METADATA_VALUES[key]();

    return dependencyMetadata[key]!;
  }
}
