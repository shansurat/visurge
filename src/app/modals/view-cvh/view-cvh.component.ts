import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-view-cvh',
  templateUrl: './view-cvh.component.html',
  styleUrls: ['./view-cvh.component.scss'],
})
export class ViewCvhComponent implements OnInit {
  cvh!: any[];

  headers = [
    '#',
    'Last Clinic Visit Date',
    'Next Appointment Date',
    'IIT Status',
    'Comment',
    'Facility',
    'Date Transferred',
  ];
  constructor(
    public modalRef: MdbModalRef<ViewCvhComponent>,
    public statusServ: StatusService
  ) {}

  ngOnInit(): void {}
}
