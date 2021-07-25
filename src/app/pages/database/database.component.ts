import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { ImportEntriesComponent } from 'src/app/modals/import-entries/import-entries.component';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
})
export class DatabaseComponent implements OnInit {
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

  entries!: Observable<any[]>;
  eligible$!: Observable<any[]>;

  getRegimenByCode = getRegimenByCode;

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
    'Eligibility',
    'Actions',
  ];
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private modalServ: MdbModalService,
    public authServ: AuthService,
    public entriesServ: EntriesService
  ) {
    this.entries = afs.collection('entries').valueChanges();

    this.eligible$ = this.entries.pipe(
      map((val) => val.filter((entry) => entry?.eligibility?.eligible))
    );
  }

  ngOnInit(): void {}

  openImportEntriesModal() {
    this.modalServ.open(ImportEntriesComponent, {
      modalClass: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
  }

  getAge(birthdate: Date) {
    if (!birthdate) return null;

    let today = new Date();
    let y = today.getFullYear() - birthdate.getFullYear();
    let m = today.getMonth() - birthdate.getMonth();
    let d = today.getDate() - birthdate.getDate();

    if (d < 0) {
      d += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      m--;
    }

    if (m < 0) {
      m += 12;
      y--;
    }

    if (m === 0 && today.getDate() < birthdate.getDate()) y--;

    return { years: y, months: m, days: d };
  }

  loadEntry(UAN: string) {
    this.router.navigate(['/entry-form', { UAN }]);
  }
}
