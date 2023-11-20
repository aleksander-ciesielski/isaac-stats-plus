import type { Container } from "~/app/ioc/Container";

export function singleton<const TArgs extends unknown[], const TEntity>(
  factory: (container: Container, ...args: TArgs) => TEntity,
): (container: Container, ...args: TArgs) => TEntity {
  let instance: TEntity | undefined;

  return (container, ...args) => {
    if (instance === undefined) {
      instance = factory(container, ...args);
    }

    return instance;
  };
}
