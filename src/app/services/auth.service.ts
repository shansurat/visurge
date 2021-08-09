import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { UserData } from '../interfaces/user-data';
import { User } from '../interfaces/user';
import { FacilitiesService } from './facilities.service';
import { Facility } from '../interfaces/facility';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isSignedIn$ = new BehaviorSubject(false);
  isAdmin$ = new BehaviorSubject(false);

  createUser!: any;

  user$!: Observable<firebase.User | null>;
  userData$: BehaviorSubject<User> = new BehaviorSubject({} as User);
  currentFacility$ = new BehaviorSubject({} as Facility);

  constructor(
    public auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private fns: AngularFireFunctions,
    private facilitiesServ: FacilitiesService
  ) {
    auth.authState
      .pipe()
      .subscribe((authState) => this.isSignedIn$.next(!!authState?.uid));

    auth.authState
      .pipe(
        mergeMap((authState) =>
          this.afs.collection('users').doc(authState?.uid).get()
        ),
        map((doc) => !!(doc.data() as any)?.admin)
      )
      .subscribe((isAdmin) => this.isAdmin$.next(isAdmin));

    this.user$ = auth.user;

    this.user$
      .pipe(
        mergeMap((user) => {
          return this.afs.collection('users').doc(user?.uid).valueChanges();
        })
      )
      .subscribe((userData) => this.userData$.next(userData as User));

    this.userData$
      .pipe(
        mergeMap((userData) =>
          this.facilitiesServ.getFacilityByCode(userData?.facility)
        ),
        map((facility) => this.currentFacility$.next(facility as Facility))
      )
      .subscribe();
  }

  signIn({ username, password }: { username: string; password: string }) {
    return this.getEmailByUsername(username).pipe(
      mergeMap((email: string) => {
        return from(this.auth.signInWithEmailAndPassword(email, password));
      })
    );
  }
  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['auth']);
    });
  }

  getEmailByUsername(username: string): Observable<string> {
    return from(
      this.afs.collection('users').ref.where('username', '==', username).get()
    ).pipe(map((doc) => (doc.docs[0].data() as any)?.email));
  }

  // accountExistence() {
  //   return (control: FormControl) =>
  //     this.fns
  //       .httpsCallable('checkAccountExistence')(control.value)
  //       .pipe(
  //         distinctUntilChanged(),
  //         map((res) => (res ? null : { accountDoesNotExist: true }))
  //       );
  // }
}
