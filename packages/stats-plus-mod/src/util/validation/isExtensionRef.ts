import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";

export function isExtensionRef(ref: unknown): ref is StatsPlusAPI.ExtensionRef {
  return (
    typeof (ref as Unvalidated<StatsPlusAPI.ExtensionRef>)?.addon === "string"
    && typeof (ref as Unvalidated<StatsPlusAPI.ExtensionRef>)?.id === "string"
  );
}
