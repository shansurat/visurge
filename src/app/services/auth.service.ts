import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isSignedIn$!: Observable<boolean>;
  isAdmin$ = new BehaviorSubject(false);

  createUser!: any;

  user$!: Observable<firebase.User | null>;
  userData$!: Observable<any>;

  constructor(
    public auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private fns: AngularFireFunctions
  ) {
    this.isSignedIn$ = auth.authState.pipe(
      map((authState) => !!authState?.uid)
    );

    auth.authState
      .pipe(
        mergeMap((authState) =>
          this.afs.collection('users').doc(authState?.uid).get()
        ),
        map((doc) => !!(doc.data() as any)?.admin)
      )
      .subscribe((isAdmin) => this.isAdmin$.next(isAdmin));

    this.user$ = auth.user;
    this.userData$ = this.user$.pipe(
      mergeMap((user) => {
        return this.afs.collection('users').doc(user?.uid).valueChanges();
      })
    );
  }

  signIn({ username, password }: { username: string; password: string }) {
    return this.getEmailByUsername(username).pipe(
      mergeMap((email: string) => {
        return from(this.auth.signInWithEmailAndPassword(email, password));
      })
    );
  }
  signOut() {
    console.log('Signing out.');

    this.auth.signOut().then(() => {
      this.router.navigate(['auth']);
    });
  }

  getEmailByUsername(username: string): Observable<string> {
    return from(
      this.afs.collection('users').ref.where('username', '==', username).get()
    ).pipe(map((doc) => (doc.docs[0].data() as any)?.email));
  }
}
