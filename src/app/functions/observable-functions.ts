import { distinctUntilChanged } from 'rxjs/operators';

export function distinctUntilChangedObj<T>() {
  return distinctUntilChanged<T>(
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
}
