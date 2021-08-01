import { distinctUntilChanged, map } from 'rxjs/operators';
import firebase from 'firebase/app';

export function distinctUntilChangedObj<T>() {
  return distinctUntilChanged<T>(
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
}

// export function timestampToDate<T, R>() {
//   return map<T, R>((afsData: any) => {
//     if (!afsData) return null;

//     const data = afsData;
//     Object.keys(data)
//       .filter((key) => data[key] instanceof firebase.firestore.Timestamp)
//       .forEach((key) => (data[key] = data[key].toDate()));
//     return data;
//   });
// }
