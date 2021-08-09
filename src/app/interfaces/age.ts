interface _Age {
  [key: string]: number | undefined;
}

export interface Age extends _Age {
  year: number;
  month: number;
  day: number;
}
