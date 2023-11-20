import type { MenuSection } from "~/types/menu/MenuSection";
import type { Menu } from "~/types/menu/Menu";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { ConfigService } from "~/services/config/ConfigService";
import { AppearanceConfig } from "~/entities/config/appearance/AppearanceConfig";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { BracketStyle } from "~/entities/config/appearance/BracketStyle";
import * as applicationConstants from "~/app/applicationConstants";
import { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";

@Singleton()
export class MenuGeneralSection implements MenuSection {
  private static readonly SUBCATEGORY_NAME = "General";

  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  public getIdentifier(): string {
    return MenuGeneralSection.SUBCATEGORY_NAME;
  }

  public register(menu: Menu): void {
    this.registerModInformationSection(menu);
    menu.space();
    this.registerApperanceSubsection(menu);
  }

  private registerModInformationSection(menu: Menu): void {
    menu
      .heading({ text: "Mod Information" })
      .readonly({
        name: "Version",
        value: applicationConstants.APPLICATION_VERSION,
      });
  }

  private registerApperanceSubsection(menu: Menu): void {
    menu
      .heading({ text: "Appearance" })
      .range({
        name: "Text Opacity",
        description: ["The opacity of the text rendered by Stats+."],
        format: (value) => `${Math.round(value * 100)}%`,
        min: AppearanceConfig.MIN_TEXT_OPACITY,
        max: AppearanceConfig.MAX_TEXT_OPACITY,
        retrieve: () => this.configService.getConfig().appearance.getTextOpacity(),
        update: (textOpacity) => {
          this.configService.updateConfigAndReload((config) => {
            config.appearance.setTextOpacity(textOpacity);
          });
        },
      })
      .select({
        name: "Bracket Style",
        description: ["Prefix and suffix characters of the text rendered by Stats+."],
        options: [
          new ProviderSelectSettingOption("None", BracketStyle.None),
          new ProviderSelectSettingOption("Square", BracketStyle.Square),
          new ProviderSelectSettingOption("Round", BracketStyle.Round),
          new ProviderSelectSettingOption("Curly", BracketStyle.Curly),
          new ProviderSelectSettingOption("Angle", BracketStyle.Angle),
        ],
        fallback: () => new ProviderSelectSettingOption(
          this.configService.getConfig().appearance.getBracketStyle(),
          this.configService.getConfig().appearance.getBracketStyle(),
        ),
        retrieve: () => this.configService.getConfig().appearance.getBracketStyle(),
        update: (bracketStyle) => {
          this.configService.updateConfigAndReload((config) => {
            config.appearance.setBracketStyle(bracketStyle);
          });
        },
      })
      .range({
        name: "Spacing",
        description: ["A distance between a stat and a provider text."],
        format: (value) => `${toFixedFormatted(value, 1)} px`,
        min: AppearanceConfig.MIN_SPACING,
        max: AppearanceConfig.MAX_SPACING,
        retrieve: () => this.configService.getConfig().appearance.getSpacing(),
        update: (spacing) => {
          this.configService.updateConfigAndReload((config) => {
            config.appearance.setSpacing(spacing);
          });
        },
      })
      .toggle({
        name: "Show provider changes",
        description: ["Displays a changed value when the provider is updated."],
        retrieve: () => this.configService.getConfig().appearance.showsProviderChanges(),
        update: (showProviderChanges) => {
          this.configService.updateConfigAndReload((config) => {
            config.appearance.setShowingOfProviderChanges(showProviderChanges);
          });
        },
      })
      .toggle({
        name: "Use shader color fix",
        description: ["(REQUIRES RESTART) Renders Stats+ without being affected by the stage colors."],
        retrieve: () => this.configService.getConfig().appearance.usesShaderColorFix(),
        update: (usesShaderColorFix) => {
          this.configService.updateConfigAndReload((config) => {
            config.appearance.setShaderColorFixUsage(usesShaderColorFix);
          });
        },
      });
  }
}
