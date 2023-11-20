export function isValidId(id: string): boolean {
  const ALLOWED_CHARACTERS = new Set("abcdefghijklmnopqrstuvwxyz0123456789-".split(""));

  if (id.length === 0) {
    return false;
  }

  return id.split("").every((character) => ALLOWED_CHARACTERS.has(character));
}
