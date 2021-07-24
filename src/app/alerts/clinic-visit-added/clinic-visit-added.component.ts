import { Component, OnInit } from '@angular/core';
import { MdbNotificationRef } from 'mdb-angular-ui-kit/notification';

@Component({
  selector: 'app-clinic-visit-added',
  templateUrl: './clinic-visit-added.component.html',
  styleUrls: ['./clinic-visit-added.component.scss'],
})
export class ClinicVisitAddedComponent implements OnInit {
  constructor(public notifRef: MdbNotificationRef<ClinicVisitAddedComponent>) {}

  ngOnInit(): void {}
}
