import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ComputableDefinition } from "~/entities/extension/provider/computable/ComputableDefinition";

export class ProviderComputablesDefinition<TComputables extends StatsPlusAPI.ComputableListDefinition> {
  public constructor(
    private readonly computables: TComputables,
  ) {}

  public getComputables(): ComputableDefinition<TComputables, unknown[], unknown>[] {
    return Object.entries(this.computables).map(
      ([name, definition]) => new ComputableDefinition(name, definition),
    );
  }
}
