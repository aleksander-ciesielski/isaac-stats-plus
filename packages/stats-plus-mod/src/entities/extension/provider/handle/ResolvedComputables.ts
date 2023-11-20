import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export class ResolvedComputables<TComputables extends StatsPlusAPI.ComputableListDefinition> {
  public constructor(private readonly computables: StatsPlusAPI.ResolvedComputableList<TComputables>) {}

  public getExternalAPI(): StatsPlusAPI.ResolvedComputableList<TComputables> {
    return this.computables;
  }
}
