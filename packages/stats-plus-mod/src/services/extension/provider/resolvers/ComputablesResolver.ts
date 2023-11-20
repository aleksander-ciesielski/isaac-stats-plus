import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ValueOf } from "type-fest";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import { ResolvedComputables } from "~/entities/extension/provider/handle/ResolvedComputables";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { ComputableExtension } from "~/entities/extension/provider/computable/ComputableExtension";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Logger } from "~/Logger";

@Singleton()
export class ComputablesResolver {
  private readonly logger = Logger.for(ComputablesResolver.name);

  public constructor(
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
  ) {}

  public resolveComputables<TComputables extends StatsPlusAPI.ComputableListDefinition>(
    provider: ProviderDefinition,
  ): ResolvedComputables<TComputables> {
    const resolvedComputables = {} as Partial<StatsPlusAPI.ResolvedComputableList<TComputables>>;

    provider.getComputables().getComputables().forEach(
      (computableDefinition) => {
        const getInitialValue = (args: unknown[]): unknown => computableDefinition.compute(
          resolvedComputables as StatsPlusAPI.ResolvedComputableList<TComputables>,
          args,
        );

        resolvedComputables[computableDefinition.getName() as keyof TComputables] = this.resolveComputable(
          provider.getExtension(),
          getInitialValue,
          computableDefinition.getName(),
        ) as ValueOf<TComputables>;
      },
    );

    return new ResolvedComputables(resolvedComputables as StatsPlusAPI.ResolvedComputableList<TComputables>);
  }

  private resolveComputable<TArgs extends unknown[], TReturnType>(
    providerExtension: ProviderExtension,
    getInitialValue: (args: TArgs) => TReturnType,
    computableName: string,
  ): (...args: TArgs) => TReturnType {
    const computable = this.extensionService.getComputable<TArgs, TReturnType>(
      new ComputableExtension(providerExtension, computableName),
    );

    return (...args: TArgs): TReturnType => {
      try {
        return computable.compute(args, getInitialValue(args));
      } catch (e) {
        this.logger.error("Error while executing a computable", e, {
          addonId: providerExtension.addonId,
          providerId: providerExtension.providerId,
          computableName,
        });

        throw e;
      }
    };
  }
}
