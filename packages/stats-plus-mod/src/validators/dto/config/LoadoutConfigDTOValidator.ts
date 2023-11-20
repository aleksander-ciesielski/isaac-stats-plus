import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { LoadoutConfigDTO } from "~/types/config/dto/loadout/LoadoutConfigDTO";
import type { LoadoutConfigEntryDTO } from "~/types/config/dto/loadout/LoadoutConfigEntryDTO";
import type { AnyConditionExtensionDTO } from "~/types/config/dto/extension/AnyConditionExtensionDTO";
import type { StandaloneConditionExtensionDTO } from "~/types/config/dto/extension/StandaloneConditionExtensionDTO";
import type { CompanionConditionExtensionDTO } from "~/types/config/dto/extension/CompanionConditionExtensionDTO";
import type { StatExtensionDTO } from "~/types/config/dto/extension/StatExtensionDTO";
import { isExtensionRef } from "~/util/validation/isExtensionRef";
import { Config } from "~/entities/config/Config";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Logger } from "~/Logger";
import { ConditionType } from "~/entities/extension/condition/ConditionType";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { ConfigMapper } from "~/mappers/config/ConfigMapper";

@Singleton()
export class LoadoutConfigDTOValidator {
  private readonly logger = Logger.for(LoadoutConfigDTOValidator.name);

  public constructor(
    @Inject(ConfigMapper) private readonly configMapper: ConfigMapper,
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
  ) {}

  public validate(loadout: Unvalidated<LoadoutConfigDTO>): LoadoutConfigDTO {
    if (loadout === undefined || !Array.isArray(loadout)) {
      this.logger.warn("Expected loadout config to be an array.");

      return Config.DEFAULT_CONFIG.loadout;
    }

    return loadout
      .map((entry) => this.getValidatedLoadoutEntry(entry))
      .filter((entry) => entry !== undefined) as LoadoutConfigDTO;
  }

  private getValidatedLoadoutEntry(
    loadoutEntry: Unvalidated<LoadoutConfigEntryDTO>,
  ): LoadoutConfigEntryDTO | undefined {
    if (typeof loadoutEntry !== "object" || loadoutEntry === null) {
      this.logger.warn("Expected loadout config entry to be an object.");

      return undefined;
    }

    const stat = this.getValidatedStatExtension(loadoutEntry.stat);
    if (stat === undefined) {
      return undefined;
    }

    return {
      stat,
      primaryProvider: this.getValidatedPrimaryProvider(stat, loadoutEntry.primaryProvider),
      secondaryProvider: this.getValidatedSecondaryProvider(stat, loadoutEntry.secondaryProvider),
      condition: this.getValidatedCondition(stat, loadoutEntry.condition),
    };
  }

  private getValidatedPrimaryProvider(
    stat: StatExtensionDTO,
    primaryProvider: Unvalidated<StatsPlusAPI.ExtensionRef>,
  ): StatsPlusAPI.ExtensionRef {
    if (!isExtensionRef(primaryProvider)) {
      this.logger.warn(
        "Expected the primary provider to be an extension ref.",
        { stat, primaryProvider, primaryProviderType: typeof primaryProvider },
      );

      return this.configMapper.toProviderExtensionDTO(
        this.extensionService.getFallbackProvider().getExtension(),
      );
    }

    return primaryProvider;
  }

  private getValidatedSecondaryProvider(
    stat: StatExtensionDTO,
    secondaryProvider: Unvalidated<StatsPlusAPI.ExtensionRef>,
  ): StatsPlusAPI.ExtensionRef {
    if (!isExtensionRef(secondaryProvider)) {
      this.logger.warn(
        "Expected the secondary provider to be an extension ref.",
        { stat, secondaryProvider, secondaryProviderType: typeof secondaryProvider },
      );

      return this.configMapper.toProviderExtensionDTO(
        this.extensionService.getFallbackProvider().getExtension(),
      );
    }

    return secondaryProvider;
  }

  private getValidatedCondition(
    stat: StatExtensionDTO,
    condition: Unvalidated<AnyConditionExtensionDTO>,
  ): AnyConditionExtensionDTO {
    if (condition?.type === ConditionType.Standalone) {
      return this.getValidatedStandaloneCondition(
        stat,
        condition as Unvalidated<StandaloneConditionExtensionDTO>,
      );
    }

    if (condition?.type === ConditionType.Companion) {
      return this.getValidatedCompanionCondition(
        stat,
        condition as Unvalidated<CompanionConditionExtensionDTO>,
      );
    }

    this.logger.warn(
      "Expected the condition to be either a standalone or companion condition extension.",
      { stat, condition, conditionType: typeof condition },
    );

    return this.configMapper.toConditionExtensionDTO(
      this.extensionService.getFallbackCondition().getExtension(),
    );
  }

  private getValidatedStandaloneCondition(
    stat: StatExtensionDTO,
    condition: Unvalidated<StandaloneConditionExtensionDTO>,
  ): AnyConditionExtensionDTO {
    if (typeof condition?.ref?.id !== "string") {
      this.logger.warn(
        "Expected standalone condition's ref.id to be a string",
        { stat, refId: condition?.ref?.id, refIdType: typeof condition?.ref?.id },
      );

      return this.configMapper.toConditionExtensionDTO(
        this.extensionService.getFallbackCondition().getExtension(),
      );
    }

    if (typeof condition?.ref?.addon !== "string") {
      this.logger.warn(
        "Expected standalone condition's ref.addon to be a string",
        { stat, refAddon: condition?.ref?.addon, refAddonType: typeof condition?.ref?.addon },
      );

      return this.configMapper.toConditionExtensionDTO(
        this.extensionService.getFallbackCondition().getExtension(),
      );
    }

    return condition as StandaloneConditionExtensionDTO;
  }

  private getValidatedCompanionCondition(
    stat: StatExtensionDTO,
    condition: Unvalidated<CompanionConditionExtensionDTO>,
  ): AnyConditionExtensionDTO {
    if (typeof condition?.id !== "string") {
      this.logger.warn(
        "Expected companion's condition id to be a string",
        { stat, id: condition?.id, idType: typeof condition?.id },
      );

      return this.configMapper.toConditionExtensionDTO(
        this.extensionService.getFallbackCondition().getExtension(),
      );
    }

    if (typeof condition?.providerRef?.id !== "string") {
      this.logger.warn(
        "Expected companion's condition providerRef.id to be a string",
        { stat, refId: condition?.providerRef?.id, refIdType: typeof condition?.providerRef?.id },
      );

      return this.configMapper.toConditionExtensionDTO(
        this.extensionService.getFallbackCondition().getExtension(),
      );
    }

    if (typeof condition?.providerRef?.addon !== "string") {
      this.logger.warn(
        "Expected companion's condition providerRef.addon to be a string",
        { stat, refAddon: condition?.providerRef?.addon, refAddonType: typeof condition?.providerRef?.addon },
      );

      return this.configMapper.toConditionExtensionDTO(
        this.extensionService.getFallbackCondition().getExtension(),
      );
    }

    return condition as CompanionConditionExtensionDTO;
  }

  private getValidatedStatExtension(
    statExtensionDTO: Unvalidated<StatExtensionDTO>,
  ): StatExtensionDTO | undefined {
    if (typeof statExtensionDTO?.id !== "string") {
      this.logger.warn("Expected stat extension id to be a string.");

      return undefined;
    }

    if (typeof statExtensionDTO?.addon !== "string") {
      this.logger.warn("Expected stat extension addon to be a string.");

      return undefined;
    }

    return statExtensionDTO as StatExtensionDTO;
  }
}
