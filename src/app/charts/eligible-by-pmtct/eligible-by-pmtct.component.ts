import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { draw } from 'patternomaly';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { hexToRGB } from 'src/app/functions/colors';
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
      backgroundColor: [
        '#3F51B5',
        draw('diagonal', hexToRGB('#3F51B5', 0.3), undefined, 5),
      ],
    },
  ];

  eligibilityChartLabels: string[] = [];

  eligibilityChartOptions = {
    rotation: -90,
    circumference: 180,
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
      this.eligibilityChartDatasets[0].data = [
        allByPMTCT.ineligible.yes.length,
        allByPMTCT.eligible.yes.length,
      ];

      this.eligibilityChartLabels = ['Ineligible', 'Eligible'];
    });
  }
}
