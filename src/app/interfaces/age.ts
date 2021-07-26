interface _Age {
  [key: string]: number | undefined;
}

export interface Age extends _Age {
  years?: number;
  months?: number;
  days?: number;
}
