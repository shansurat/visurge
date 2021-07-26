import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, map, mergeMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isDeviceRecognized = new BehaviorSubject(true);

  signInFormGroup!: FormGroup;

  constructor(
    public authServ: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.signInFormGroup = this.fb.group({
      username: [
        '',
        [Validators.required, AuthValidators.usernameValidity()],
        [
          AuthValidators.accountExistence(this.afs),
          AuthValidators.accountEnabled(this.afs),
        ],
      ],
      password: '',
    });
  }

  signIn() {
    this.authServ.signIn(this.signInFormGroup.value).subscribe((res) => {
      console.log(res);
      console.log('Signed In');
      this.router.navigate(['dashboard']);
    });
  }

  signOut() {
    this.authServ.signOut();
  }
}

export class AuthValidators {
  // Synchronous Validators
  static usernameValidity() {
    return (control: FormControl) => {
      const username: string = control.value;

      return username.length
        ? username.match(/^[a-z0-9]+$/i)
          ? null
          : { notUsername: true }
        : null;
    };
  }

  // Asynchronous Validators
  static accountExistence(afs: AngularFirestore) {
    return (control: FormControl) => {
      const username: string = control.value;

      return afs
        .collection('users', (ref) => ref.where('username', '==', username))
        .valueChanges()
        .pipe(
          debounceTime(250),
          take(1),
          map((res) => {
            return res.length ? null : { accountDoesNotExist: true };
          })
        );
    };
  }

  static accountEnabled(afs: AngularFirestore) {
    return (control: FormControl) => {
      const username: string = control.value;

      return afs
        .collection('users', (ref) =>
          ref.where('username', '==', username).where('enabled', '==', true)
        )
        .valueChanges()
        .pipe(
          debounceTime(250),
          take(1),
          map((res) => {
            console.log(res);
            return res.length ? null : { accountDisabled: true };
          })
        );
    };
  }
}
