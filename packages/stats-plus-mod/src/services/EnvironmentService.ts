import { Inject } from "~/app/ioc/decorators/Inject";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class EnvironmentService {
  public constructor(
    @Inject(InjectionToken.OptionsAPI) private readonly options: typeof Options,
  ) {}

  public isRepentancePlus(): boolean {
    return (this.options.JacobEsauControls !== undefined);
  }
}
