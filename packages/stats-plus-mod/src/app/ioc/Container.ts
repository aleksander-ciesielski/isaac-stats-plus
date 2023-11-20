import type { DependencyIdentifier } from "~/app/ioc/dependency/DependencyIdentifier";
import type { ResolvedDependency } from "~/app/ioc/dependency/ResolvedDependency";
import type { DependencyResolver } from "~/app/ioc/dependency/DependencyResolver";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export class Container {
  private readonly resolvers = new Map<DependencyIdentifier, DependencyResolver<DependencyIdentifier>>();
  private readonly args = new Map<DependencyIdentifier, DependencyIdentifier[]>();

  public register<TIdentifier extends DependencyIdentifier>(
    identifier: TIdentifier,
    resolver: DependencyResolver<TIdentifier>,
  ): void {
    this.resolvers.set(identifier, resolver);
  }

  public registerArg(
    target: DependencyIdentifier,
    identifier: DependencyIdentifier,
    index: number,
  ): void {
    if (!this.args.has(target)) {
      this.args.set(target, []);
    }

    const args = this.args.get(target)!;
    args[index] = identifier;
  }

  public resolve<TIdentifier extends DependencyIdentifier>(
    identifier: TIdentifier,
  ): ResolvedDependency<TIdentifier> {
    const resolver = this.resolvers.get(identifier);
    if (resolver === undefined) {
      throw new ErrorWithContext(
        "No resolver found for the given dependency.",
        { identifier },
      );
    }

    const args = this.getArgs(identifier);
    return resolver(this, ...args) as ResolvedDependency<TIdentifier>;
  }

  private getArgs<TIdentifier extends DependencyIdentifier>(
    identifier: TIdentifier,
  ): unknown[] {
    const argIdentifiers = this.args.get(identifier) ?? [];
    return argIdentifiers.map((argIdentifier) => this.resolve(argIdentifier));
  }
}
