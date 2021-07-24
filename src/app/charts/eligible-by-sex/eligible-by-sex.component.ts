import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Chart } from 'chart.js';
import { MdbChartDirective } from 'mdb-angular-ui-kit/charts';
import { combineLatest, interval, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'eligible-by-sex',
  templateUrl: './eligible-by-sex.component.html',
  styleUrls: ['./eligible-by-sex.component.scss'],
})
export class EligibleBySexComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') mdbChart!: MdbChartDirective;

  eligibilityChartDatasets: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
    },
  ];

  eligibilityChartDatasets_Bar: any[] = [
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

  eligibilityChartPlugins = [ChartDataLabels];

  sex$!: Observable<number[]>;
  entries$!: Observable<any[]>;

  showAllFormControl: FormControl = new FormControl();

  constructor(private afs: AngularFirestore) {
    Chart.register(ChartDataLabels);

    this.entries$ = afs.collection('entries').valueChanges();
    this.sex$ = afs
      .collection('entries')
      .valueChanges()
      .pipe(
        map((entries) => {
          const mCount = entries.filter(
            (entry: any) => entry.sex == 'male'
          ).length;
          return [mCount, entries.length - mCount];
        })
      );
  }

  ngOnInit() {
    this.entries$.subscribe((entries) => {
      this.eligibilityChartDatasets = [
        {
          data: getSex(entries),
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
      ];

      this.eligibilityChartDatasets_Bar = [
        {
          data: getSex(entries),
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
        {
          data: getSex(entries, false),
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['rgba(18,102,241,.3)', 'rgba(249,49,84,.3)'],
        },
      ];

      this.eligibilityChartLabels = ['Male', 'Female'];
    });
  }

  ngAfterViewInit(): void {}

  updateData(data: any) {
    this.eligibilityChartDatasets[0].data = data;
    this.eligibilityChartLabels = ['Male', 'Female'];
  }
}

function getSex(entries: any[], eligible: boolean = true) {
  const eligibles = entries.filter((entry) => entry.eligibility.eligible);
  const ineligibles = entries.filter((entry) => !entry.eligibility.eligible);

  // Eligibles Count
  const mCount_e = eligibles.filter((entry) => entry.sex == 'male').length;

  // Ineligibles Count
  const mCount_i = ineligibles.filter((entry) => entry.sex == 'male').length;

  // All Count
  const mCount = entries.filter((entry) => entry.sex == 'male').length;

  return eligible
    ? [mCount_e, eligibles.length - mCount_e]
    : [mCount_i, ineligibles.length - mCount_i];
}
