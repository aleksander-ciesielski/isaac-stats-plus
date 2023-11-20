import type { Container } from "~/app/ioc/Container";

export function transient<const TArgs extends unknown[], const TEntity>(
  factory: (container: Container, ...args: TArgs) => TEntity,
): (container: Container, ...args: TArgs) => TEntity {
  return (container, ...args) => factory(container, ...args);
}
