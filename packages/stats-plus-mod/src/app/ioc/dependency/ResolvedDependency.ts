import type { DependencyIdentifier } from "~/app/ioc/dependency/DependencyIdentifier";
import type { DependencyResolver } from "~/app/ioc/dependency/DependencyResolver";

export type ResolvedDependency<TIdentifier extends DependencyIdentifier> = (
  ReturnType<DependencyResolver<TIdentifier>>
);
