import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { draw } from 'patternomaly';
import { combineLatest, Observable, zip } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { hexToRGB } from 'src/app/functions/colors';
import { EntriesService } from 'src/app/services/entries.service';

const cvsColors = ['#00b74a', '#ffeb3b', '#ffa900', '#f93154'];

@Component({
  selector: 'cvs-by-iit',
  templateUrl: './cvs-by-iit.component.html',
  styleUrls: ['./cvs-by-iit.component.scss'],
})
export class CvsByIitComponent implements OnInit {
  cvsChartDatasets = [
    {
      label: 'Ineligible',
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: cvsColors,
    },
    {
      label: 'Eligible',
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: cvsColors.map((color) =>
        draw('diagonal', hexToRGB(color, 0.3), undefined, 5)
      ),
    },
  ];

  entries$!: Observable<any[]>;
  cvs$!: Observable<number[]>;

  cvsChartLabels: string[] = [];

  cvsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            min: 0,
            precision: 0,
          },
        },
      },
    },
  };

  showAllFormControl: FormControl = new FormControl(false);
  constructor(private entriesServ: EntriesService) {}

  ngOnInit(): void {
    this.entriesServ.entries_formatted_count$.subscribe((count) => {
      const iit_eligible_count = count?.eligible.iit;
      const iit_ineligible_count = count?.ineligible.iit;
      if (!iit_eligible_count) return (this.cvsChartDatasets[0].data = []);

      this.cvsChartDatasets[0].data = Object.values(iit_eligible_count);
      this.cvsChartDatasets[1].data = Object.values(iit_ineligible_count);

      this.cvsChartLabels = [
        'Active',
        'IIT ≤ 1',
        'IIT ≤ 3',
        'IIT 3⁺',
        'TI',
        'TO',
        'LTFU',
        'Dead',
      ];

      return;
    });
  }

  showAll(val: boolean = true) {
    if (this.showAllFormControl.value == val) return;
    this.showAllFormControl.setValue(val);
  }
}
