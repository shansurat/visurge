import { FirestoreEntry } from '../interfaces/firestore-entry';
import firebase from 'firebase/app';
export class Entry {
  private entry: FirestoreEntry;

  constructor(entryVal: FirestoreEntry) {
    this.entry = entryVal;
  }

  get UAN() {
    return this.entry.uniqueARTNumber;
  }

  get ARTStartDate() {
    return this.entry.ARTStartDate.toDate();
  }
}

function timestampToDate(timestamp: firebase.firestore.Timestamp) {
  return timestamp.toDate();
}
