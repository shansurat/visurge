export function UANToId(UAN: string) {
  return UAN.replace(/\//g, '').toUpperCase();
}
