import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Chart } from 'chart.js';
import { MdbChartDirective } from 'mdb-angular-ui-kit/charts';
import { combineLatest, interval, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EntriesService } from 'src/app/services/entries.service';
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  eligibilityChartOptions_Bar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(public entriesServ: EntriesService) {}

  ngOnInit() {
    this.entriesServ.allBySex$.subscribe((allBySex) => {
      this.eligibilityChartDatasets = [
        {
          data: [
            allBySex.eligible.male.length,
            allBySex.eligible.female.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
      ];

      this.eligibilityChartDatasets_Bar = [
        {
          label: ['Eligible'],
          data: [
            allBySex.eligible.male.length,
            allBySex.eligible.female.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
        {
          label: ['Ineligible'],

          data: [
            allBySex.ineligible.male.length,
            allBySex.ineligible.female.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['rgba(18,102,241,.3)', 'rgba(249,49,84,.3)'],
        },
      ];

      this.eligibilityChartLabels = ['Male', 'Female'];
    });
  }

  ngAfterViewInit(): void {}
}
