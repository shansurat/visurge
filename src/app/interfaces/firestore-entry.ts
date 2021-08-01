import firebase from 'firebase/app';
export interface FirestoreEntry {
  ARTStartDate: firebase.firestore.Timestamp;
  age: {
    age: number;
    unit: string;
  };
  birthdate: firebase.firestore.Timestamp;
  cvh: CVH[];
  eac3Completed?: string;
  eac3CompletionDate?: firebase.firestore.Timestamp;
  entryDate: firebase.firestore.Timestamp;
  facility: string;
  hvl: string;
  id: string;
  nextViralLoadSampleCollectionDate: firebase.firestore.Timestamp;
  pendingStatusDate?: firebase.firestore.Timestamp;
  phoneNumber: string;
  pmtct: string;
  pmtctEnrollStartDate: firebase.firestore.Timestamp;
  regimen: string;
  regimenStartTransDate: firebase.firestore.Timestamp;
  sex: string;
  uniqueARTNumber: string;
  vlh: VLH[];
}

interface CVH {
  clinicVisitComment: string;
  dateTransferred?: firebase.firestore.Timestamp;
  lastClinicVisitDate?: firebase.firestore.Timestamp;
  nextAppointmentDate?: firebase.firestore.Timestamp;
  facility?: string;
}
interface VLH {
  dateSampleCollected: firebase.firestore.Timestamp;
  value?: number;
  undetectableViralLoad?: boolean;
}
