import type { Constructor } from "type-fest";
import { singleton } from "~/app/ioc/resolution/singleton";
import { APPLICATION_CONTAINER } from "~/app/APPLICATION_CONTAINER";

export function Singleton<const TEntity>() {
  return (target: Constructor<TEntity>) => {
    APPLICATION_CONTAINER.register(
      target,
      // eslint-disable-next-line new-cap
      singleton((container, ...args) => new target(...args as ConstructorParameters<typeof target>)),
    );
  };
}
