import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
});

export const createUser = functions.https.onCall(async (data, context) => {
  let uid = (
    await admin.auth().createUser({
      email: `${data.user.username}@visurge.com`,
      password: data.user.password,
    })
  ).uid;

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

export const deleteUser = functions.https.onCall(async (data, context) => {
  let uid = data.uid;
  await admin.auth().deleteUser(uid);
  await admin.firestore().collection('users').doc(uid).delete();
});
