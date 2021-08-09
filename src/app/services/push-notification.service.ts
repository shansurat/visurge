import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap } from 'rxjs/operators';
import { PushNotification } from '../interfaces/push-notification';
import { AuthService } from './auth.service';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  pushNotifs$!: Observable<PushNotification[]>;

  constructor(private afs: AngularFirestore, private authServ: AuthService) {
    this.pushNotifs$ = authServ.user$.pipe(
      mergeMap((user: firebase.User | null) =>
        afs.collection('users').doc(user?.uid).valueChanges()
      ),
      map((userData: any) => {
        return userData?.pushNotifs as PushNotification[];
      })
    );
  }

  addPushNotif(n: PushNotification) {
    this.authServ.user$
      .pipe(
        mergeMap((user) => {
          return this.afs
            .collection('users')
            .doc(user?.uid)
            .update({
              pushNotifs: firebase.firestore.FieldValue.arrayUnion(n),
            });
        })
      )
      .subscribe((res) => {});
  }

  clearPushNotifs() {
    this.authServ.user$
      .pipe(
        mergeMap((user) => {
          return this.afs.collection('users').doc(user?.uid).update({
            pushNotifs: [],
          });
        })
      )
      .subscribe((res) => {});
  }
}
