import type { Constructor } from "type-fest";
import { transient } from "~/app/ioc/resolution/transient";
import { APPLICATION_CONTAINER } from "~/app/APPLICATION_CONTAINER";

export function Transient<const TEntity>() {
  return (target: Constructor<TEntity>) => {
    APPLICATION_CONTAINER.register(
      target,
      // eslint-disable-next-line new-cap
      transient((container, ...args) => new target(...args as ConstructorParameters<typeof target>)),
    );
  };
}
