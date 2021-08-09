import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import * as functions from 'firebase-functions';

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
});

const afs = admin.firestore();

afs.settings({
  ignoreUndefinedProperties: true,
});

export const createUser = functions.https.onCall(async (data, context?) => {
  const uid = (
    await admin.auth().createUser({
      email: `${data.user.username}@visurge.com`,
      password: data.user.password,
    })
  ).uid;

  await admin.auth().setCustomUserClaims(uid, { admin: data.user.admin });

  await admin
    .firestore()
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

export const updateUser = functions.https.onCall(async (data, context?) => {
  const { uid, admin } = data.user;

  await admin.auth().setCustomUserClaims(uid, { admin });

  await admin
    .firestore()
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

export const deleteUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.auth().deleteUser(uid);
  await afs.collection('users').doc(uid).delete();
});

export const accountCanSignIn = functions.https.onCall(
  async (data, context) => {
    const docs = (
      await admin
        .firestore()
        .collection('users')
        .where('username', '==', data)
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
