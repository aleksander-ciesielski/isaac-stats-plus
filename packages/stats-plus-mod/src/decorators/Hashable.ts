import type { Class } from "type-fest";
import { Metadata } from "~/app/Metadata";

export function Hashable<const TClass extends Class<unknown>>() {
  return (target: TClass) => {
    Metadata.setMetadata(target, "IS_HASHABLE", true);
    Metadata.setMetadata(target, "HASHABLES", [
      ...Metadata.getMetadata(target, "HASHABLES"),
      () => target.name,
    ]);
  };
}
