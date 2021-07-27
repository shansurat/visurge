import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { userInfo } from 'os';
import { of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { UserEditedALertComponent } from 'src/app/alerts/user-edited-alert/user-edited-alert.component';
import { User } from 'src/app/interfaces/user';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  isLoading!: boolean;

  user!: User;

  editUserFormGroup!: FormGroup;

  constructor(
    private afs: AngularFirestore,
    private fns: AngularFireFunctions,
    private fb: FormBuilder,
    public modalRef: MdbModalRef<EditUserComponent>,
    private notifServ: MdbNotificationService,
    public facilitiesServ: FacilitiesService
  ) {}

  ngOnInit(): void {
    const user = this.user;

    this.editUserFormGroup = this.fb.group({
      username: [
        user.username,
        [
          Validators.required,
          Validators.minLength(6),
          EditUserValidators.usernameValidity(),
        ],
        [EditUserValidators.usernameExistence(this.afs, user.username)],
      ],
      password: [user.password, [Validators.required, Validators.minLength(6)]],
      admin: [user.admin],
      facility: [user.facility],
    });

    this.editUserFormGroup.get('admin')?.valueChanges.subscribe((admin) => {
      if (admin) {
        this.editUserFormGroup.get('facility')?.reset();
        this.editUserFormGroup.get('facility')?.clearValidators();
      } else {
        this.editUserFormGroup
          .get('facility')
          ?.setValidators([Validators.required]);
      }
    });
  }

  editUser() {
    this.isLoading = true;
    this.fns
      .httpsCallable('updateUser')({
        user: { ...this.editUserFormGroup.value, uid: this.user.uid },
      })
      .subscribe(() => {
        this.modalRef.close();
        this.notifServ.open(UserEditedALertComponent, {
          autohide: true,
        });
      });
  }
}

export class EditUserValidators {
  // Synchronous Validators
  static usernameValidity() {
    return (control: FormControl) => {
      const username: string = control.value;

      return username.match(/^[a-z0-9]+$/i) ? null : { notUsername: true };
    };
  }

  // Asynchronous Validators
  static usernameExistence(afs: AngularFirestore, currentUsername: string) {
    return (control: FormControl) => {
      const username: string = control.value;

      if (username == currentUsername) return of(null);

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
