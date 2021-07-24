import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'eligible-by-pmtct',
  templateUrl: './eligible-by-pmtct.component.html',
  styleUrls: ['./eligible-by-pmtct.component.scss'],
})
export class EligibleByPMTCTComponent implements OnInit {
  eligibilityChartDatasets: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
    },
  ];

  eligibilityChartLabels: string[] = ['Male', 'Female'];

  eligibilityChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  pmtct$!: Observable<any>;

  constructor(private afs: AngularFirestore) {
    this.pmtct$ = afs
      .collection('entries')
      .valueChanges()
      .pipe(
        map((entries) => {
          const mCount = entries.filter(
            (entry: any) => entry.pmtct == 'yes'
          ).length;
          return [mCount, entries.length - mCount];
        })
      );

    this.pmtct$.subscribe((data: number[]) => this.updateData(data));
  }
  ngOnInit(): void {}

  updateData(data: any) {
    this.eligibilityChartDatasets[0].data = data;
    this.eligibilityChartLabels = ['Yes', 'No'];
  }
}
