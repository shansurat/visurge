export function incDate(date1: Date, days: number): Date {
  return new Date(date1.getTime() + days * 24 * 60 * 60 * 1000);
}
