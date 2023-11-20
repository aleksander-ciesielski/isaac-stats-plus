import type { Class, Constructor } from "type-fest";
import { Metadata } from "~/app/Metadata";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export function getClassConstructor<TEntity>(arg: Constructor<TEntity> | TEntity): Constructor<TEntity> | undefined {
  if (typeof arg === "object" && arg!.constructor !== undefined) {
    return (arg as Constructor<TEntity>).constructor as Class<TEntity>;
  }

  if (typeof arg === "function") {
    return arg as Constructor<TEntity>;
  }

  return undefined;
}

export function Hash<TTarget, const TKey extends keyof TTarget, const TResult>(
  transform?: (value: TTarget) => TResult,
) {
  return (target: Class<TTarget> | TTarget, propertyKey: TKey): void => {
    const ctor = getClassConstructor(target);
    if (ctor === undefined) {
      throw new ErrorWithContext("Could not get a constructor for the @Hash() target.", {
        propertyKey,
      });
    }

    Metadata.setMetadata(ctor, "HASHABLES", [
      ...Metadata.getMetadata(ctor, "HASHABLES"),
      (transform === undefined)
        ? (instance) => (instance as TTarget)[propertyKey]
        : (instance) => transform(instance as TTarget),
    ]);
  };
}
