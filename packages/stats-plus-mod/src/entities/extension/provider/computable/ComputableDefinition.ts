import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export class ComputableDefinition<
  TComputables extends StatsPlusAPI.ComputableListDefinition,
  TArgs extends unknown[],
  TReturnType,
> {
  public constructor(
    private readonly name: string,
    private readonly definition: StatsPlusAPI.ComputableDefinition<TArgs, TReturnType>,
  ) {}

  public getName(): string {
    return this.name;
  }

  public compute(
    resolvedComputables: StatsPlusAPI.ResolvedComputableList<TComputables>,
    args: TArgs,
  ): TReturnType {
    return this.definition.apply(resolvedComputables, args);
  }
}
