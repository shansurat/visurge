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
    private router: Router,
    private fns: AngularFireFunctions,
    private facilitiesServ: FacilitiesService
  ) {
    auth.authState.subscribe((authState) =>
      this.isSignedIn$.next(!!authState?.uid)
    );

    this.user$ = auth.user;

    // Set userData$
    auth.user
      .pipe(
        mergeMap((user) => fns.httpsCallable('getUserDataByUID')(user?.uid))
      )
      .subscribe((userData) => this.userData$.next(userData as User));

    // Set admin$
    this.userData$.subscribe((userData) => this.isAdmin$.next(userData.admin));

    // Set currentFacility$
    this.userData$
      .pipe(
        mergeMap((userData) =>
          this.facilitiesServ.getFacilityById(userData?.facility)
        ),
        map((facility) => this.currentFacility$.next(facility as Facility))
      )
      .subscribe();
  }

  signIn({ username, password }: { username: string; password: string }) {
    return this.fns
      .httpsCallable('getEmailByUsername')(username)
      .pipe(
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
}
