import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MdbChartDirective } from 'mdb-angular-ui-kit/charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { regimens } from 'src/app/constants/regimens';

@Component({
  selector: 'eligible-by-regimen',
  templateUrl: './eligible-by-regimen.component.html',
  styleUrls: ['./eligible-by-regimen.component.scss'],
})
export class EligibleByRegimenComponent implements OnInit {
  @ViewChild('chart') mdbChart!: MdbChartDirective;

  eligibilityChartDatasets: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#673AB7', '#3F51B5'],
    },
  ];

  eligibilityChartLabels: string[] = ['TLD', 'TLE'];

  eligibilityChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  regimen$!: Observable<number[]>;

  constructor(private afs: AngularFirestore) {
    this.regimen$ = afs
      .collection('entries')
      .valueChanges()
      .pipe(
        map((entries) => {
          const mCount = entries.filter((entry: any) => {
            const code = entry.regimen;

            return (
              regimens.filter((regimen) => regimen.code == code)[0].category ==
              'TLD'
            );
          }).length;
          return [mCount, entries.length - mCount];
        })
      );

    this.regimen$.subscribe((data: number[]) => this.updateData(data));
  }

  async ngOnInit() {}

  ngAfterViewInit(): void {}

  updateData(data: any) {
    this.eligibilityChartDatasets[0].data = data;
    this.eligibilityChartLabels = ['TLD', 'TLE'];
  }
}
