import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MdbChartDirective } from 'mdb-angular-ui-kit/charts';
import { draw } from 'patternomaly';
import { hexToRGB } from 'src/app/functions/colors';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'eligible-by-sex',
  templateUrl: './eligible-by-sex.component.html',
  styleUrls: ['./eligible-by-sex.component.scss'],
})
export class EligibleBySexComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') mdbChart!: MdbChartDirective;

  eligibilityChartDatasetsForMale: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
    },
  ];

  eligibilityChartDatasetsForFemale: any[] = [
    {
      data: [],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ['#1266F1', '#F93154'],
    },
  ];
  eligibilityChartLabels: string[] = ['Eligible', 'Ineligible'];

  eligibilityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        position: 'nearest',
      },
    },
  };

  constructor(public entriesServ: EntriesService) {}

  ngOnInit() {
    this.entriesServ.allBySex$.subscribe((allBySex) => {
      this.eligibilityChartDatasetsForMale = [
        {
          data: [
            allBySex.eligible.male.length,
            allBySex.ineligible.male.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: [
            draw('diagonal', hexToRGB('#2196F3', 0.3), undefined, 5),
            '#2196F3',
          ],
        },
      ];

      this.eligibilityChartDatasetsForFemale = [
        {
          data: [
            allBySex.eligible.female.length,
            allBySex.ineligible.female.length,
          ],
          fill: true,
          fillColor: '#fff',
          backgroundColor: [
            draw('diagonal', hexToRGB('#F44336', 0.3), undefined, 5),
            '#F44336',
          ],
        },
      ];

      this.eligibilityChartLabels = ['Eligible', 'Ineligible'];
    });
  }

  ngAfterViewInit(): void {}
}
