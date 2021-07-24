import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClinicVisitEntry } from 'src/app/interfaces/clinic-visit-entry';
import { UserEntry } from 'src/app/interfaces/user-entry';
import { Timestamp } from '@google-cloud/firestore';
import { diffDate } from 'src/app/functions/diffDate';

@Component({
  selector: 'app-view-cvh',
  templateUrl: './view-cvh.component.html',
  styleUrls: ['./view-cvh.component.scss'],
})
export class ViewCvhComponent implements OnInit {
  cvh!: ClinicVisitEntry[];
  entryDate!: Date;

  constructor(
    public modalRef: MdbModalRef<ViewCvhComponent>,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    console.log(this.cvh, this.entryDate);
  }

  toDate(date: any) {
    if (date) return date?.toDate();
  }
}
