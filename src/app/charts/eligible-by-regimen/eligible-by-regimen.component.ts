import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MdbChartDirective } from 'mdb-angular-ui-kit/charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { regimens } from 'src/app/constants/regimens';
import { EntriesService } from 'src/app/services/entries.service';

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

  eligibilityChartDatasets_Bar: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
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

  eligibilityChartOptions_Bar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(
    private afs: AngularFirestore,
    public entriesServ: EntriesService
  ) {}

  ngOnInit() {
    this.entriesServ.allByRegimen$.subscribe((entries) => {
      this.eligibilityChartDatasets = [
        {
          data: [entries.eligible.TLD.length, entries.eligible.TLE.length],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#B23CFD'],
        },
      ];

      this.eligibilityChartDatasets_Bar = [
        {
          label: ['Eligible'],
          data: [entries.eligible.TLD.length, entries.eligible.TLE.length],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#B23CFD'],
        },
        {
          label: ['Ineligible'],
          data: [entries.ineligible.TLD.length, entries.ineligible.TLE.length],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['rgba(18,102,241,.3)', 'rgba(178,60,253,.3)'],
        },
      ];

      this.eligibilityChartLabels = ['TLD', 'TLE'];
    });
  }

  ngAfterViewInit(): void {}

  updateData(data: any) {
    this.eligibilityChartDatasets[0].data = data;
    this.eligibilityChartLabels = ['TLD', 'TLE'];
  }
}
