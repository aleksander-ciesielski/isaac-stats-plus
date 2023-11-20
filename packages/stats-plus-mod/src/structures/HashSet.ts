import { StructuralComparator } from "~/services/StructuralComparator";

export class HashSet<T> {
  private readonly structuralComparator = new StructuralComparator();

  private readonly elements: Map<unknown, T>;

  public constructor(entries?: readonly T[]) {
    this.elements = new Map(entries?.map((element) => [this.structuralComparator.hash(element), element]));
  }

  public get size(): number {
    return this.elements.size;
  }

  public clone(): HashSet<T> {
    return new HashSet(Array.from(this.values()));
  }

  public has(value: T): boolean {
    return this.elements.has(this.structuralComparator.hash(value));
  }

  public add(value: T): this {
    this.elements.set(this.structuralComparator.hash(value), value);
    return this;
  }

  public clear(): void {
    this.elements.clear();
  }

  public delete(value: T): boolean {
    return this.elements.delete(this.structuralComparator.hash(value));
  }

  public values(): IterableIterator<T> {
    return this.elements.values();
  }
}
