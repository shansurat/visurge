export interface User {
  admin: boolean;
  createdAt: firebase.default.firestore.Timestamp;
  email: string;
  username: string;
  uid: string;
}