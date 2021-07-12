import { Component, OnInit } from '@angular/core';
import { MdbNotificationRef } from 'mdb-angular-ui-kit/notification';

@Component({
  selector: 'app-user-loaded-alert',
  templateUrl: './user-loaded-alert.component.html',
  styleUrls: ['./user-loaded-alert.component.scss'],
})
export class UserLoadedAlertComponent implements OnInit {
  uniqueARTNumber!: string;

  constructor(public notifRef: MdbNotificationRef<UserLoadedAlertComponent>) {}

  ngOnInit(): void {}
}
