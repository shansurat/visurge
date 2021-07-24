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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  users$!: Observable<User[]>;

  headers = ['Admin', 'Username', 'Password', 'Created At', 'Actions'];

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
        console.log('deleted');
      });
  }
}
