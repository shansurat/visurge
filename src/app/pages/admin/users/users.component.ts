import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { FacilitiesService } from 'src/app/services/facilities.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  isLoading = false;

  config = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: true,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  headers = [
    '',
    'Admin',
    'Username',
    'Password',
    'Facility',
    'Created At',
    'Actions',
  ];

  constructor(
    private afs: AngularFirestore,
    private modalServ: MdbModalService,
    private fns: AngularFireFunctions,
    public authServ: AuthService,
    private notifServ: MdbNotificationService,
    public usersServ: UsersService,
    public facilitiesServ: FacilitiesService
  ) {}

  ngOnInit(): void {}

  openNewUserModal() {
    this.modalServ.open(NewUserComponent, {
      modalClass: 'modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  openEditUserModal(user: User) {
    this.modalServ.open(EditUserComponent, {
      modalClass: 'modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
      data: { user },
    });
  }

  deleteUser(uid: string) {
    this.isLoading = true;

    this.fns
      .httpsCallable('deleteUser')({
        uid,
      })
      .subscribe((uid) => {
        this.isLoading = false;
        this.notifServ.open(UserDeletedAlertComponent, { autohide: true });
      });
  }

  toggleUser(user: User) {
    const currState = user?.enabled;
    this.afs
      .collection('users')
      .doc(user.uid)
      .set({ enabled: !currState }, { merge: true });
  }
}
