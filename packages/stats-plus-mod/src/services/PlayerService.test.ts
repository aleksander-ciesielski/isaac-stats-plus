import type { Mocked } from "~/testing/types/Mocked";
import type { ModMockWithEvents } from "~/testing/mocks/createModMockWithEvents";
import type { LifecycleService } from "~/services/LifecycleService";
import { mock } from "vitest-mock-extended";
import { ModCallback } from "isaac-typescript-definitions";
import { PlayerService } from "~/services/PlayerService";
import { createModMockWithEvents } from "~/testing/mocks/createModMockWithEvents";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { createJsonSerializerMock } from "~/testing/mocks/services/createJsonSerializerMock";

describe("PlayerService", () => {
  let isaac: Mocked<typeof Isaac>;
  let game: Mocked<Game>;
  let modWithEvents: ModMockWithEvents;
  let modCallbackService: ModCallbackService;
  let lifecycleService: Mocked<LifecycleService>;
  let playerService: PlayerService;

  beforeEach(() => {
    isaac = mock<typeof Isaac>();
    game = mock<Game>();
    modWithEvents = createModMockWithEvents();
    lifecycleService = mock<LifecycleService>();
    modCallbackService = new ModCallbackService(createJsonSerializerMock(), modWithEvents.mod);
    playerService = new PlayerService(isaac, game, modCallbackService, lifecycleService);
  });

  describe("getPlayers", () => {
    it("calls the LifecycleService.prototype.reload once, one tick after the player init.", () => {
      const entityPlayer = mock<EntityPlayer>();
      game.GetNumPlayers.mockReturnValue(1);
      isaac.GetPlayer.calledWith(0).mockReturnValue(entityPlayer);

      playerService.reload();

      expect(lifecycleService.reloadAll).toHaveBeenCalledTimes(0);
      modWithEvents.events.broadcast(ModCallback.POST_PLAYER_INIT, entityPlayer);
      expect(lifecycleService.reloadAll).toHaveBeenCalledTimes(0);
      modWithEvents.events.broadcast(ModCallback.POST_UPDATE);
      expect(lifecycleService.reloadAll).toHaveBeenCalledTimes(1);
      modWithEvents.events.broadcast(ModCallback.POST_UPDATE);
      expect(lifecycleService.reloadAll).toHaveBeenCalledTimes(1);
    });
  });
});
