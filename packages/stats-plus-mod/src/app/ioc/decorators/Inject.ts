import type { Class } from "type-fest";
import type { DependencyIdentifier } from "~/app/ioc/dependency/DependencyIdentifier";
import type { ResolvedDependency } from "~/app/ioc/dependency/ResolvedDependency";
import { APPLICATION_CONTAINER } from "~/app/APPLICATION_CONTAINER";

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const __COMPILE_ERROR_INCOMPATIBLE_INJECT_TARGET_PARAMETER_TYPE__: unique symbol;

type InjectReturnType<
  TTarget extends Class<unknown>,
  TIdentifier extends DependencyIdentifier,
  TIndex extends number,
> = (
  ConstructorParameters<TTarget>[TIndex] extends ResolvedDependency<TIdentifier>
    ? undefined
    : typeof __COMPILE_ERROR_INCOMPATIBLE_INJECT_TARGET_PARAMETER_TYPE__
);

export function Inject<
  const TTarget extends Class<unknown>,
  const TIdentifier extends DependencyIdentifier,
  const TIndex extends number,
>(identifier: TIdentifier) {
  return (
    target: TTarget,
    propertyKey: undefined,
    parameterIndex: TIndex,
  ): InjectReturnType<TTarget, TIdentifier, TIndex> => {
    APPLICATION_CONTAINER.registerArg(target, identifier, parameterIndex);
    return undefined as InjectReturnType<TTarget, TIdentifier, TIndex>;
  };
}
