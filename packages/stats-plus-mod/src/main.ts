import { registerEssentialsAddon } from "@isaac-stats-plus/essentials-addon";
import * as json from "json";
import { ApplicationLifecycleManager } from "~/services/ApplicationLifecycleManager";
import { APPLICATION_CONTAINER } from "~/app/APPLICATION_CONTAINER";
import { registerCoreAddon } from "~/core/registerCoreAddon";
import { injectionTokenEntityMapping } from "~/app/ioc/injectionTokenEntityMapping";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { Logger } from "~/Logger";

try {
  Object.entries(injectionTokenEntityMapping).forEach(([token, resolver]) => {
    APPLICATION_CONTAINER.register(token as unknown as InjectionToken, resolver);
  });

  const logger = Logger.for("main");

  logger.debug("Registering the core addon...");
  registerCoreAddon(APPLICATION_CONTAINER.resolve(InjectionToken.ModAPI));
  logger.debug("Core addon registered.");

  logger.debug("Registering the essentials addon...");
  registerEssentialsAddon(
    APPLICATION_CONTAINER.resolve(InjectionToken.ModAPI),
    json, // For some reason it won't work with the value of InjectionToken.JsonSerializer
  );
  logger.debug("Essentials addon registered.");

  logger.debug("Setting up ApplicationLifecycleManager...");
  APPLICATION_CONTAINER.resolve(ApplicationLifecycleManager).setup();
  logger.debug("ApplicationLifecycleManager ready.");
} catch (e: any) {
  Isaac.DebugString(`(FATAL) [Stats+] Uncaught error: "${e?.message ?? e}"`);
  throw e;
}
