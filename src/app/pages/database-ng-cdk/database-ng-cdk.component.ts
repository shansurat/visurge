import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ageToText, getAge } from 'src/app/functions/getAge';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { timestampToDateForObj } from 'src/app/functions/timestampToDate';
import { ViewVlhComponent } from 'src/app/modals/view-vlh/view-vlh.component';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { ViewCVHService } from 'src/app/services/view-cvh.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-database-ng-cdk',
  templateUrl: './database-ng-cdk.component.html',
  styleUrls: ['./database-ng-cdk.component.scss'],
})
export class DatabaseNgCdkComponent implements OnInit {
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
  dataSource = ELEMENT_DATA;

  headers = [
    'Entry Date',
    'Facility',
    'Unique ART Number',
    'ART Start Date',
    'Sex',
    'Age',
    'Phone Number',
    'Regimen',
    'Start/ Transition Date',
    'Pregnant/Breastfeeding',
    'PMTCT Enrollment Start Date',
    'High Viral Load',
    'EAC-3 Completed',
    'EAC-3 Completion Date',
    'Pending Status',
    'Pending Status Date',
    'Eligibility',
    'Actions',
  ];

  getAge = getAge;
  ageToText = ageToText;
  getRegimenByCode = getRegimenByCode;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private modalServ: MdbModalService,
    public authServ: AuthService,
    public entriesServ: EntriesService,
    public facilitiesServ: FacilitiesService,
    public viewCVHServ: ViewCVHService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {}

  generateReport(UAN: string) {
    this.router.navigate(['/report', { UAN }]);
  }

  viewVLH(vlh: any[]) {
    this.modalServ.open(ViewVlhComponent, {
      data: {
        vlh: (vlh as any[]).map((vl) => timestampToDateForObj(vl)),
      },
      modalClass:
        'modal-dialog-centered modal-lg modal-fullscreen-md-down modal-dialog-scrollable',
    });
  }

  viewCVH(cvh: any[]) {
    const _cvh = (cvh as any[]).map((cv) => timestampToDateForObj(cv));
    this.viewCVHServ.viewCVH(_cvh);
  }

  loadEntry(UAN: string) {
    this.router.navigate(['/entry-form', { UAN }]);
  }
}
