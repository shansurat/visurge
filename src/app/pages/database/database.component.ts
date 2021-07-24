import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  headers = [
    'Entry Date',
    'Unique ART Number',
    'ART Start Date',
    'Sex',
    'Age',
    'Phone Number',
    'Regimen',
    'Pregnant/Breastfeeding',
    'PMTCT Enrollment Start Date',
    'High Viral Load',
    'EAC-3 Completed',
    'EAC-3 Completion Date',
    'Eligibility',
    'Actions',
  ];
  constructor(private afs: AngularFirestore, private router: Router) {
    this.entries = afs
      .collection('entries')
      .valueChanges()
      .pipe(
        map((val) => {
          console.log(val);
          return val;
        })
      );
    this.eligible$ = this.entries.pipe(
      map((val) => val.filter((entry) => entry?.eligibility?.eligible))
    );
  }

  ngOnInit(): void {}

  getAge(birthdate: Date) {
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