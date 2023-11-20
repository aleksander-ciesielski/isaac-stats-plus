import type { Stringifiable } from "~/util/types/Stringifiable";
import type { Class } from "type-fest";
import { Metadata } from "~/app/Metadata";
import { getClassConstructor } from "~/decorators/Hash";
import { isStringifiable } from "~/util/types/Stringifiable";
import { Transient } from "~/app/ioc/decorators/Transient";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Transient()
export class StructuralComparator {
  private static readonly HASH_COMPONENT_SEPARATOR = ";";

  public compare<TValue>(first: TValue, second: TValue): boolean {
    return (this.hash(first) === this.hash(second));
  }

  public hash<TClass extends Class<unknown>>(instance: InstanceType<TClass>): unknown {
    return this.isHashable(instance)
      ? this.hashElements(this.getHashableComponents(instance))
      : instance;
  }

  private getHashableComponents<TClass extends Class<unknown>>(instance: InstanceType<TClass>): Stringifiable[] {
    const cls = getClassConstructor(instance);
    if (cls === undefined) {
      throw new Error("Could not get a constructor for the getHashableComponents target.");
    }

    return Metadata.getMetadata(cls, "HASHABLES").map((fn) => {
      const value = fn(instance);

      if (this.isHashable(value)) {
        return this.hash(value);
      }

      if (isStringifiable(value)) {
        return value;
      }

      throw new ErrorWithContext("Could not hash.", { value, type: typeof value });
    }).filter((value) => value !== undefined) as Stringifiable[];
  }

  private isHashable<TEntity>(entity: any): entity is TEntity {
    const cls = getClassConstructor(entity);
    return (cls !== undefined && Metadata.getMetadata(cls, "IS_HASHABLE"));
  }

  private hashElements(components: Stringifiable[]): number {
    const concatenated = components
      .map((component) => component.toString())
      .join(StructuralComparator.HASH_COMPONENT_SEPARATOR);

    let hash = 0;
    for (let i = 0; i < concatenated.length; i += 1) {
      const char = concatenated.charCodeAt(i);
      // eslint-disable-next-line no-bitwise
      hash = (((hash << 5) - hash) + char) | 0;
    }

    return hash;
  }
}
