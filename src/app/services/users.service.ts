import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$ = new BehaviorSubject([] as User[]);

  constructor(private afs: AngularFirestore) {
    this.afs
      .collection('users')
      .valueChanges()
      .pipe(map((users) => this.users$.next(users as User[])))
      .subscribe();
  }
}
