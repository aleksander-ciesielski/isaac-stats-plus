import type { ExtensionRef } from "~/ExtensionRef";

export interface ComputableRef {
  provider: ExtensionRef;
  computable: string;
}
