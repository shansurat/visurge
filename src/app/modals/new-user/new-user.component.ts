import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, map, take } from 'rxjs/operators';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { NewUserCreatedAlertComponent } from 'src/app/alerts/new-user-created-alert/new-user-created-alert.component';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewUserComponent implements OnInit {
  isLoading!: boolean;
  newUserFormGroup!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public modalRef: MdbModalRef<NewUserComponent>,
    private fns: AngularFireFunctions,
    private notifServ: MdbNotificationService,
    public facilitiesServ: FacilitiesService
  ) {}

  ngOnInit(): void {
    this.newUserFormGroup = this.fb.group({
      username: [
        '',
        [Validators.required, NewUserValidators.usernameValidity()],
        [NewUserValidators.usernameExistence(this.afs)],
      ],
      password: ['', [Validators.required]],
      admin: [''],
      enabled: [true],
      facility: ['', [Validators.required]],
    });
  }

  addUser() {
    this.isLoading = true;
    this.fns
      .httpsCallable('createUser')({
        user: this.newUserFormGroup.value,
      })
      .subscribe((uid) => {
        if (uid) this.modalRef.close();
        this.notifServ.open(NewUserCreatedAlertComponent, {
          autohide: true,
        });
      });
  }
}

export class NewUserValidators {
  // Synchronous Validators
  static usernameValidity() {
    return (control: FormControl) => {
      const username: string = control.value;

      return username.match(/^[a-z0-9]+$/i) ? null : { notUsername: true };
    };
  }

  // Asynchronous Validators
  static usernameExistence(afs: AngularFirestore) {
    return (control: FormControl) => {
      const username: string = control.value;

      return afs
        .collection('users', (ref) => ref.where('username', '==', username))
        .valueChanges()
        .pipe(
          debounceTime(250),
          take(1),
          map((res) => {
            return res.length ? { usernameAlreadyExists: true } : null;
          })
        );
    };
  }
}
