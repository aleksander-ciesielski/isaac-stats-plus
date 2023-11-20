import type { MenuSection } from "~/types/menu/MenuSection";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { Menu } from "~/types/menu/Menu";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { ConfigService } from "~/services/config/ConfigService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Logger } from "~/Logger";
import { ModConfigMenuSettingMapper } from "~/services/extension/provider/ModConfigMenuSettingMapper";
import { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";

@Singleton()
export class MenuProvidersSection implements MenuSection {
  private static readonly SUBCATEGORY_NAME = "Providers";
  private static readonly CURRENTLY_IN_USE_SUBSECTION_NAME = "Currently In Use";
  private static readonly ALL_PROVIDERS_SUBSECTION_NAME = "All Providers";

  private static readonly AVAILABLE_COLOR_OPTIONS: ProviderSelectSettingOption<ProviderColor>[] = [
    new ProviderSelectSettingOption("None", ProviderColor.None),
    new ProviderSelectSettingOption("Grey", ProviderColor.Grey),
    new ProviderSelectSettingOption("Red", ProviderColor.Red),
    new ProviderSelectSettingOption("Green", ProviderColor.Green),
    new ProviderSelectSettingOption("Blue", ProviderColor.Blue),
    new ProviderSelectSettingOption("Orange", ProviderColor.Orange),
    new ProviderSelectSettingOption("Magenta", ProviderColor.Magenta),
    new ProviderSelectSettingOption("Cyan", ProviderColor.Cyan),
  ];

  private readonly logger = Logger.for(MenuProvidersSection.name);

  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
    @Inject(ModConfigMenuSettingMapper) private readonly modConfigMenuSettingMapper: ModConfigMenuSettingMapper,
  ) {}

  public getIdentifier(): string {
    return MenuProvidersSection.SUBCATEGORY_NAME;
  }

  public register(menu: Menu): void {
    this.registerCurrentlyInUseSubsection(menu);
    menu.space();
    this.registerAllProvidersSubsection(menu);
  }

  private registerCurrentlyInUseSubsection(menu: Menu): void {
    menu.heading({ text: MenuProvidersSection.CURRENTLY_IN_USE_SUBSECTION_NAME });
    menu.space();

    this.registerProviders(menu, this.configService.getConfig().loadout.getCurrentlyUsedProviders());
  }

  private registerAllProvidersSubsection(menu: Menu): void {
    menu.heading({ text: MenuProvidersSection.ALL_PROVIDERS_SUBSECTION_NAME });
    menu.space();

    this.registerProviders(menu, this.extensionService.getAvailableProviders());
  }

  private registerProviders(menu: Menu, providers: ProviderExtension[]): void {
    providers.forEach((extension) => {
      const provider = this.extensionService.getProvider(extension);

      if (provider === undefined) {
        this.logger.warn("Could not find provider for extension, skipping provider options registration.", {
          providerId: extension.providerId,
          addonId: extension.addonId,
        });

        return;
      }

      if (provider.getExtension().isCoreExtension()) {
        return;
      }

      menu.subheading({ text: provider.getName() });
      this.registerBuiltInSettings(menu, provider);
      this.registerCustomSettings(menu, provider);

      menu.space();
    });
  }

  private registerBuiltInSettings(menu: Menu, provider: ProviderDefinition): void {
    menu.select({
      fallback: () => new ProviderSelectSettingOption("None", ProviderColor.None),
      name: "Color",
      description: ["Color of the provider"],
      options: MenuProvidersSection.AVAILABLE_COLOR_OPTIONS,
      retrieve: () => this.configService.getConfig().providerSettings.getProviderColor(provider),
      update: (value) => {
        this.configService.updateConfigAndReload((config) => {
          config.providerSettings.setProviderColor(provider.getExtension(), value);
        });
      },
    });
  }

  private registerCustomSettings(menu: Menu, provider: ProviderDefinition): void {
    Object.values(provider.getSettings().getSettings()).forEach((setting) => {
      const entity = this.modConfigMenuSettingMapper.map(provider.getExtension(), setting);
      menu.register(entity);
    });
  }
}
