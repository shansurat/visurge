import { Component, OnInit } from '@angular/core';
import { draw } from 'patternomaly';
import { hexToRGB } from 'src/app/functions/colors';
import { distinctUntilChangedObj } from 'src/app/functions/observable-functions';
import { EntriesService } from 'src/app/services/entries.service';

const ageColors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#1E88E5',
  '#0288D1',
  '#0097A7',
  '#26A69A',
  '#43A047',
];

const patternType = 'diagonal';

@Component({
  selector: 'eligible-by-age',
  templateUrl: './eligible-by-age.component.html',
  styleUrls: ['./eligible-by-age.component.scss'],
})
export class EligibleByAgeComponent implements OnInit {
  datasets = [
    {
      label: 'Ineligible',
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ageColors,
    },
    {
      label: 'Eligible',
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: ageColors.map((color, i) =>
        draw(patternType, hexToRGB(color, 0.3), undefined, 5)
      ),
    },
  ];

  chartLabels: string[] = [];

  labels: any[] = [
    { label: '<1', color: '#F44336' },
    { label: '1-9', color: '#E91E63' },
    { label: '10-14', color: '#9C27B0' },
    { label: '15-19', color: '#673AB7' },
    { label: '20-24', color: '#3F51B5' },
    { label: '25-29', color: '#1E88E5' },
    { label: '30-34', color: '#0288D1' },
    { label: '35-39', color: '#0097A7' },
    { label: '40-49', color: '#26A69A' },
    { label: '50+', color: '#43A047' },
  ];

  options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(public entriesServ: EntriesService) {
    entriesServ.age$.pipe(distinctUntilChangedObj()).subscribe((age) => {
      let i: any[] = [];
      Object.values(age.ineligible).forEach((entries: any) =>
        i.push(entries.length)
      );

      this.datasets[0].data = i;

      let e: any[] = [];
      Object.values(age.eligible).forEach((entries: any) =>
        e.push(entries.length)
      );
      this.datasets[1].data = e;

      this.chartLabels = [
        '<1',
        '1-9',
        '10-14',
        '15-19',
        '20-24',
        '25-29',
        '30-34',
        '35-39',
        '40-49',
        '50+',
      ];
    });
  }

  ngOnInit(): void {}
}
