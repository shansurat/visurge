import { Component, OnInit } from '@angular/core';
import { MdbNotificationRef } from 'mdb-angular-ui-kit/notification';

@Component({
  selector: 'app-user-updated-alert',
  templateUrl: './user-updated-alert.component.html',
  styleUrls: ['./user-updated-alert.component.scss'],
})
export class UserUpdatedAlertComponent implements OnInit {
  uniqueARTNumber!: string;

  constructor(public notifRef: MdbNotificationRef<UserUpdatedAlertComponent>) {}

  ngOnInit(): void {}
}
