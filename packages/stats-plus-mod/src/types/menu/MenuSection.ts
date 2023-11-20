import type { Menu } from "~/types/menu/Menu";

export interface MenuSection {
  getIdentifier(): string;
  register(menu: Menu): void;
}
