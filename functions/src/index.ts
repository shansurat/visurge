import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import * as functions from 'firebase-functions';
import { regimens } from './regimens';

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
});

const afs = admin.firestore();
type Timestamp = admin.firestore.Timestamp;

afs.settings({
  ignoreUndefinedProperties: true,
});

interface IObjectKeys {
  [key: string]: any;
}

interface Age extends IObjectKeys {
  age: number;
  unit: string;
}

interface ViralLoadEntry extends IObjectKeys {
  value: number;
  dateSampleCollected: Timestamp;
  undetectableViralLoad?: boolean;
}

interface ViralLoadEntry_Local extends IObjectKeys {
  value: number;
  dateSampleCollected: number;
  undetectableViralLoad?: boolean;
}

interface ClinicVisitEntry extends IObjectKeys {
  lastClinicVisitDate: Timestamp;
  clinicVisitComment: string;
  nextAppointmentDate?: Timestamp;
  iitStatus?: string;
  facility?: string;
  dateTransferred?: Timestamp;
}

interface ClinicVisitEntry_Local extends IObjectKeys {
  lastClinicVisitDate: number;
  clinicVisitComment: string;
  nextAppointmentDate?: number;
  iitStatus?: string;
  facility?: string;
  dateTransferred?: number;
}

interface Entry extends IObjectKeys {
  id: string;
  entryDate: Timestamp;
  sex: string;
  uniqueARTNumber: string;
  birthdate?: Timestamp;
  age?: Age;
  ageUnit?: string;
  phoneNumber?: string;
  ARTStartDate: Timestamp;
  regimen: string;
  regimenStartTransDate: Timestamp;
  pmtct: boolean;
  pmtctEnrollStartDate?: Timestamp;
  hvl: boolean;
  eac3Completed?: boolean;
  eac3CompletionDate?: Timestamp;
  vlh: ViralLoadEntry[];
  cvh: ClinicVisitEntry[];
}

interface Regimen extends IObjectKeys {
  ageCategory: string;
  category: string;
  code: string;
  regimen: string;
}

interface Entry_Local extends IObjectKeys {
  id: string;
  entryDate: number;
  sex: string;
  uniqueARTNumber: string;
  birthdate?: number;
  age?: Age;
  ageUnit?: string;
  phoneNumber?: string;
  ARTStartDate: number;
  regimen: Regimen;
  regimenStartTransDate: number;
  pmtct: boolean;
  pmtctEnrollStartDate?: number;
  hvl: boolean;
  eac3Completed?: boolean;
  eac3CompletionDate?: number;
  vlh: ViralLoadEntry_Local[];
  cvh: ClinicVisitEntry_Local[];
}

// Create User
export const createUser = functions.https.onCall(async (data, context?) => {
  const uid = (
    await admin.auth().createUser({
      email: `${data.user.username}@visurge.com`,
      password: data.user.password,
    })
  ).uid;

  await admin.auth().setCustomUserClaims(uid, { admin: data.user.admin });

  await afs
    .collection('users')
    .doc(uid)
    .set({
      email: `${data.user.username}@visurge.com`,
      ...data.user,
      uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return uid;
});

// pdate User
export const updateUser = functions.https.onCall(async (data, context?) => {
  const { uid, admin } = data.user;

  await admin.auth().setCustomUserClaims(uid, { admin });

  await afs
    .collection('users')
    .doc(uid)
    .set(
      {
        ...data.user,
        lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
});

// Delete User
export const deleteUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.auth().deleteUser(uid);
  await afs.collection('users').doc(uid).delete();
});

// Sign In Validators
export const accountCanSignIn = functions.https.onCall(
  async (username, context) => {
    const docs = (
      await afs
        .collection('users')
        .where('username', '==', username)
        .limit(1)
        .get()
    ).docs;

    return docs.length
      ? docs[0].data().enabled
        ? true
        : 'accountDisabled'
      : 'accountDoesNotExist';
  }
);
// Get Email by Username
export const getEmailByUsername = functions.https.onCall(
  async (username, context) => {
    const docs = (
      await afs
        .collection('users')
        .where('username', '==', username)
        .limit(1)
        .get()
    ).docs;

    return docs.length ? docs[0].data().email : null;
  }
);
// Get User Data by UID
export const getUserDataByUID = functions.https.onCall(async (uid, context) => {
  const docs = (
    await afs.collection('users').where('uid', '==', uid).limit(1).get()
  ).docs;

  return docs.length ? docs[0].data() : null;
});

// get Entries
export const getEntries = functions.https.onCall(
  async (
    { isAdvancedFilter, filter, sortBy, asc, pageSize, currentPage },
    context
  ) => {
    const _entries = (await afs.collection('entries').orderBy(sortBy).get())
      .docs;

    // .map((res) => {
    //   const entry = res.data() as Entry;
    //   const entry_local: Entry_Local = {
    //     id: entry.id,
    //     entryDate: entry.entryDate.toMillis(),
    //     sex: entry.sex,
    //     uniqueARTNumber: entry.uniqueARTNumber,
    //     birthdate: entry?.birthdate?.toMillis(),
    //     age: entry?.age,
    //     phoneNumber: entry?.phoneNumber,
    //     ARTStartDate: entry.ARTStartDate.toMillis(),
    //     regimen: regimens.find(
    //       (regimen) => regimen.code == entry.regimen
    //     ) as Regimen,
    //     regimenStartTransDate: entry.regimenStartTransDate.toMillis(),
    //     pmtct: entry.pmtct,
    //     pmtctEnrollStartDate: entry.pmtctEnrollStartDate?.toMillis(),
    //     hvl: entry.hvl,
    //     eac3Completed: entry.eac3Completed,
    //     eac3CompletionDate: entry.eac3CompletionDate?.toMillis(),
    //     vlh: entry.vlh.map((vl) => {
    //       return {
    //         value: vl.value,
    //         undetectableViralLoad: vl?.undetectableViralLoad,
    //         dateSampleCollected: vl.dateSampleCollected.toMillis(),
    //       };
    //     }),
    //     cvh: entry.cvh.map((_cv) => {
    //       const {
    //         lastClinicVisitDate,
    //         nextAppointmentDate,
    //         dateTransferred,
    //         ...cv
    //       } = _cv;
    //       return {
    //         ...cv,
    //         lastClinicVisitDate: lastClinicVisitDate?.toMillis(),
    //         nextAppointmentDate: nextAppointmentDate?.toMillis(),
    //         dateTransferred: dateTransferred?.toMillis(),
    //       };
    //     }),
    //   };

    //   return entry_local;
    // });

    const entries: Entry_Local[] = [];

    for (let res of _entries) {
      const {
        entryDate,
        ARTStartDate,
        birthdate,
        regimenStartTransDate,
        pmtctEnrollStartDate,
        eac3CompletionDate,
        regimen,
        vlh,
        cvh,
        ..._entry
      } = res.data() as Entry;

      entries.push({
        entryDate: entryDate.toMillis(),
        ARTStartDate: ARTStartDate.toMillis(),
        birthdate: birthdate?.toMillis(),
        regimenStartTransDate: regimenStartTransDate.toMillis(),
        pmtctEnrollStartDate: pmtctEnrollStartDate?.toMillis(),
        eac3CompletionDate: eac3CompletionDate?.toMillis(),
        regimen: regimens.find(
          (regimen) => regimen.code == _entry.regimen
        ) as Regimen,
        vlh: vlh.map((vl: ViralLoadEntry): ViralLoadEntry_Local => {
          return {
            value: vl?.value,
            undetectableViralLoad: vl?.undetectableViralLoad,
            dateSampleCollected: vl.dateSampleCollected.toMillis(),
          };
        }),
        cvh: cvh.map((_cv: ClinicVisitEntry): ClinicVisitEntry_Local => {
          const {
            lastClinicVisitDate,
            nextAppointmentDate,
            dateTransferred,
            ...cv
          } = _cv;
          return {
            ...cv,
            lastClinicVisitDate: lastClinicVisitDate?.toMillis(),
            nextAppointmentDate: nextAppointmentDate?.toMillis(),
            dateTransferred: dateTransferred?.toMillis(),
          };
        }),
        ..._entry,
      });
    }

    return entries;
  }
);

// Get Statistics
export const updateStatistics = functions.https.onCall(
  async (data, context) => {
    const docs = (
      await afs.collection('users').where('username', '==', data).limit(1).get()
    ).docs;

    return docs.length
      ? docs[0].data().enabled
        ? true
        : 'accountDisabled'
      : 'accountDoesNotExist';
  }
);
