import type { Class } from "type-fest";
import type { InjectionToken } from "~/app/ioc/InjectionToken";

export type DependencyIdentifier =
  | InjectionToken
  | Class<unknown>;
