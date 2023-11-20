import { mapIterator } from "~/util/iterator/mapIterator";
import { StructuralComparator } from "~/services/StructuralComparator";

export class HashMap<K, V> {
  private readonly structuralComparator = new StructuralComparator();

  private readonly hashToValueMapping: Map<unknown, V>;
  private readonly hashToKeyMapping: Map<unknown, K>;

  public constructor(entries?: readonly (readonly [K, V])[]) {
    this.hashToValueMapping = new Map(entries?.map(([key, value]) => [this.structuralComparator.hash(key), value]));
    this.hashToKeyMapping = new Map(entries?.map(([key]) => [this.structuralComparator.hash(key), key]));
  }

  public get size(): number {
    return this.hashToValueMapping.size;
  }

  public clone(): HashMap<K, V> {
    return new HashMap(Array.from(this.entries()));
  }

  public has(key: K): boolean {
    return this.hashToValueMapping.has(this.structuralComparator.hash(key));
  }

  public get(key: K): V | undefined {
    return this.hashToValueMapping.get(this.structuralComparator.hash(key));
  }

  public set(key: K, value: V): this {
    const hash = this.structuralComparator.hash(key);

    this.hashToValueMapping.set(hash, value);
    this.hashToKeyMapping.set(hash, key);

    return this;
  }

  public clear(): void {
    this.hashToValueMapping.clear();
    this.hashToKeyMapping.clear();
  }

  public delete(key: K): boolean {
    const hash = this.structuralComparator.hash(key);

    const mapEntryDeleted = this.hashToValueMapping.delete(hash);
    const hashToKeyMappingEntryDeleted = this.hashToKeyMapping.delete(hash);

    return (mapEntryDeleted || hashToKeyMappingEntryDeleted);
  }

  public keys(): IterableIterator<K> {
    return this.hashToKeyMapping.values();
  }

  public values(): IterableIterator<V> {
    return this.hashToValueMapping.values();
  }

  public entries(): IterableIterator<[K, V]> {
    return mapIterator(this.hashToKeyMapping.entries(), ([hash, key]) => {
      const value = this.hashToValueMapping.get(hash);
      if (value === undefined) {
        throw new Error(`Could not find a value by "${hash?.toString()}" hash.`);
      }

      return [key, value];
    });
  }
}
