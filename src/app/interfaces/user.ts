export interface User {
  admin: boolean;
  createdAt: firebase.default.firestore.Timestamp;
  email: string;
  username: string;
  password: string;
  uid: string;
  enabled: boolean;
  facility: string;
}
