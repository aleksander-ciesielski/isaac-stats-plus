/** @noSelf */
declare interface ModConfigMenuInterface {
  AddTitle(
    categoryName: string,
    subcategoryName: string,
    text: string,
    color?: [number, number, number],
  ): void;
}

declare interface ModConfigMenuSetting {
  Color?: [number, number, number];
}
