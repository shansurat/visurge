export function diffDate(date1: Date, date2: Date): number {
  if (!(date1 && date2)) return -1;
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}
