import { ModConfigMenuService } from "~/services/menu/ModConfigMenuService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";

@Singleton()
export class MenuService {
  public constructor(
    @Inject(ModConfigMenuService) private readonly modConfigMenuService: ModConfigMenuService,
  ) {}

  public reload(): void {
    this.modConfigMenuService.reload();
  }
}
