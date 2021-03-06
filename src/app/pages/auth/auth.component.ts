import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isDeviceRecognized = new BehaviorSubject(true);

  signInFormGroup!: FormGroup;

  accountExistenceIsLoading = false;

  passwordIsHidden = true;

  constructor(
    public authServ: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private fns: AngularFireFunctions
  ) {}

  ngOnInit(): void {
    this.signInFormGroup = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(6), this.usernameValidity()],
        [this.accountCanSignIn()],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.username.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe((status) => {
        status == 'VALID' ? this.password.enable() : this.password.disable();
      });
  }

  get username() {
    return this.signInFormGroup.get('username') as FormControl;
  }

  get password() {
    return this.signInFormGroup.get('password') as FormControl;
  }

  signIn() {
    this.authServ
      .signIn(this.signInFormGroup.value)
      .toPromise()
      .then(() => this.router.navigate(['dashboard']))
      .catch(
        ({ code, message }) =>
          code == 'auth/wrong-password' &&
          this.password.setErrors({ wrongPassword: true })
      );
  }

  signOut() {
    this.authServ.signOut();
  }

  // Validators

  // Synchronous
  private usernameValidity() {
    return (control: FormControl) => {
      const username: string = control.value;

      return username.length
        ? username.match(/^[a-z0-9]+$/i)
          ? null
          : { notUsername: true }
        : null;
    };
  }

  private accountCanSignIn() {
    return (control: FormControl) => {
      return this.fns
        .httpsCallable('accountCanSignIn')(control.value)
        .pipe(
          distinctUntilChanged(),
          map((res) => (res === true ? null : { [res]: true }))
        );

      // this.afs
      //   .collection('users', (ref) =>
      //     ref.where('username', '==', control.value).limit(1)
      //   )
      //   .get()
      //   .pipe(
      //     map((qs) => {
      //       const docs = qs.docs as any[];
      //       return docs.length
      //         ? docs[0].data().enabled
      //           ? null
      //           : { accountDisabled: true }
      //         : { accountDoesNotExist: true };
      //     }),
      //     distinctUntilChanged()
      //   );
    };
  }
}
