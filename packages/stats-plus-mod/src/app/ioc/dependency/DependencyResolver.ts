/* eslint-disable @typescript-eslint/indent */

import type { Class } from "type-fest";
import type { InjectionToken } from "~/app/ioc/InjectionToken";
import type { injectionTokenEntityMapping } from "~/app/ioc/injectionTokenEntityMapping";
import type { DependencyIdentifier } from "~/app/ioc/dependency/DependencyIdentifier";
import type { Container } from "~/app/ioc/Container";

export type DependencyResolver<TIdentifier extends DependencyIdentifier> = (
  TIdentifier extends Class<infer TEntity> ? ((container: Container, ...args: unknown[]) => TEntity) :
  TIdentifier extends InjectionToken ? typeof injectionTokenEntityMapping[TIdentifier]
  : never
);
