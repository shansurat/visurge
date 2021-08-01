import firebase from 'firebase/app';

export function timestampToDateForObj(_obj: any) {
  const obj = _obj;
  Object.keys(obj)
    .filter((key) => obj[key] instanceof firebase.firestore.Timestamp)
    .forEach((key) => (obj[key] = obj[key].toDate()));
  return obj;
}
