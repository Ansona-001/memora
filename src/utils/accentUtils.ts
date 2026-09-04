export function accentIndexFromId(id: string, modulo = 6): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % modulo;
  }
  return Math.abs(hash);
}
