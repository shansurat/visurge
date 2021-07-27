import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntriesService } from 'src/app/services/entries.service';

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

  eligibilityChartDatasets_Bar: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
    },
  ];

  eligibilityChartLabels: string[] = ['Yes', 'No'];

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
    this.entriesServ.allByPMTCT$.subscribe((allByPMTCT) => {
      this.eligibilityChartDatasets = [
        {
          data: [allByPMTCT.eligible.yes.length, allByPMTCT.eligible.no.length],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
      ];

      this.eligibilityChartDatasets_Bar = [
        {
          label: ['Ineligible'],
          data: [allByPMTCT.eligible.yes.length, allByPMTCT.eligible.no.length],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['#1266F1', '#F93154'],
        },
        {
          label: ['Eligible'],

          data: [
            allByPMTCT.ineligible.yes.length,
            allByPMTCT.ineligible.no.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: ['rgba(18,102,241,.3)', 'rgba(249,49,84,.3)'],
        },
      ];

      this.eligibilityChartLabels = ['Yes', 'No'];
    });
  }
}
