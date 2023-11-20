import type { MenuSection } from "~/types/menu/MenuSection";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { Menu } from "~/types/menu/Menu";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { ConfigService } from "~/services/config/ConfigService";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { CORE_STAT_EXTENSIONS } from "~/data/stat/CORE_STAT_EXTENSIONS";
import { HashMap } from "~/structures/HashMap";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";
import { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";

@Singleton()
export class MenuLoadoutSection implements MenuSection {
  private static readonly SECTION_NAME = "Loadout";

  private static readonly STAT_TYPE_SUBSECTION_NAMES = new Map<StatExtension, string>([
    [speed, "Speed"],
    [tears, "Tears"],
    [damage, "Damage"],
    [range, "Range"],
    [shotSpeed, "Shot Speed"],
    [luck, "Luck"],
  ]);

  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
  ) {}

  public getIdentifier(): string {
    return MenuLoadoutSection.SECTION_NAME;
  }

  public register(menu: Menu): void {
    CORE_STAT_EXTENSIONS.forEach((stat) => {
      const name = MenuLoadoutSection.STAT_TYPE_SUBSECTION_NAMES.get(stat);
      if (name === undefined) {
        throw new ErrorWithContext("Could not find a name of the stat.", { stat });
      }

      this.registerStatSection(menu, stat, name);
    });
  }

  private registerStatSection(
    menu: Menu,
    stat: StatExtension,
    subSectionName: string,
  ): void {
    const loadoutEntry = this.configService.getConfig().loadout.getLoadoutEntry(stat);

    const availableConditions = this.extensionService.getAvailableConditions(loadoutEntry)
      .map((extension) => ({ extension, condition: this.extensionService.getCondition(extension) }))
      .filter((payload) => (payload.condition !== undefined))
      .map(({ extension, condition }) => new ProviderSelectSettingOption(condition!.getName(), extension));

    const availableProviders = this.extensionService.getAvailableProviders()
      .map((extension) => ({ extension, provider: this.extensionService.getProvider(extension) }))
      .filter((payload) => (payload.provider?.isStatSupported(stat) === true))
      .map(({ extension, provider }) => new ProviderSelectSettingOption(provider!.getName(), extension));

    if (availableProviders.every((extension) => extension.getValue().isCoreExtension())) {
      return;
    }

    this.registerStatSectionEntities(
      menu,
      stat,
      subSectionName,
      availableProviders,
      availableConditions,
    );
  }

  private registerStatSectionEntities(
    menu: Menu,
    stat: StatExtension,
    subSectionName: string,
    providerOptions: ProviderSelectSettingOption<ProviderExtension>[],
    conditionOptions: ProviderSelectSettingOption<AnyConditionExtension>[],
  ): void {
    const providerOptionsMap = new HashMap(providerOptions.map((key) => [key.getValue(), key]));

    menu
      .subheading({ text: subSectionName })
      .select({
        name: "When",
        description: [
          this.extensionService
            .resolveCondition(this.configService.getConfig().loadout.getLoadoutEntry(stat))
            .getDescription(),
        ],
        options: conditionOptions,
        fallback: () => new ProviderSelectSettingOption(
          this.extensionService.getFallbackCondition().getName(),
          this.extensionService.getFallbackCondition().getExtension(),
        ),
        retrieve: () => this.configService.getConfig().loadout.getCondition(stat),
        update: (condition) => {
          this.configService.updateConfigAndReload((config) => {
            config.loadout.setCondition(stat, condition);
          });
        },
      })
      .select({
        name: "Then",
        description: [
          this.extensionService
            .resolveProvider(this.configService.getConfig().loadout.getPrimaryProvider(stat))
            .getDescription(),
        ],
        options: providerOptions,
        fallback: () => new ProviderSelectSettingOption(
          this.extensionService.getFallbackProvider().getName(),
          this.extensionService.getFallbackProvider().getExtension(),
        ),
        retrieve: () => {
          const current = this.configService.getConfig().loadout.getPrimaryProvider(stat);
          const matching = providerOptionsMap.get(current);

          return matching?.getValue();
        },
        update: (provider) => {
          this.configService.updateConfigAndReload((config) => {
            config.loadout.setPrimaryProvider(stat, provider);
          });
        },
      })
      .select({
        name: "Else",
        description: [
          this.extensionService
            .resolveProvider(this.configService.getConfig().loadout.getSecondaryProvider(stat))
            .getDescription(),
        ],
        options: providerOptions,
        fallback: () => new ProviderSelectSettingOption(
          this.extensionService.getFallbackProvider().getName(),
          this.extensionService.getFallbackProvider().getExtension(),
        ),
        condition: () => {
          const condition = this.configService.getConfig().loadout.getCondition(stat);
          if (condition instanceof StandaloneConditionExtension) {
            return !condition.isAlwaysCondition();
          }

          return true;
        },
        retrieve: () => {
          const current = this.configService.getConfig().loadout.getSecondaryProvider(stat);
          const matching = providerOptionsMap.get(current);

          return matching?.getValue();
        },
        update: (provider) => {
          this.configService.updateConfigAndReload((config) => {
            config.loadout.setSecondaryProvider(stat, provider);
          });
        },
      })
      .space();
  }
}
