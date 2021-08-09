import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDeletedAlertComponent } from 'src/app/alerts/user-deleted-alert/user-deleted-alert.component';
import { User } from 'src/app/interfaces/user';
import { EditUserComponent } from 'src/app/modals/edit-user/edit-user.component';
import { NewUserComponent } from 'src/app/modals/new-user/new-user.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  users$!: Observable<User[]>;

  headers = ['Admin', 'Username', 'Created At', 'Actions'];

  constructor(
    private afs: AngularFirestore,
    private modalServ: MdbModalService,
    private fns: AngularFireFunctions,
    public authServ: AuthService,
    private notifServ: MdbNotificationService
  ) {}

  ngOnInit(): void {
    this.users$ = this.afs
      .collection('users')
      .valueChanges()
      .pipe(map((res) => res as User[]));
  }

  openNewUserModal() {
    this.modalServ.open(NewUserComponent, {
      modalClass: 'modal-dialog-centered',
    });
  }

  openEditUserModal(user: User) {
    this.modalServ.open(EditUserComponent, {
      modalClass: 'modal-dialog-centered',
      data: { user },
    });
  }

  deleteUser(uid: string) {
    this.fns
      .httpsCallable('deleteUser')({
        uid,
      })
      .subscribe((uid) => {
        this.notifServ.open(UserDeletedAlertComponent, { autohide: true });
      });
  }
}
