import { Component, OnInit } from '@angular/core';
import { ChartOptions, LinearScale } from 'chart.js';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

@Component({
  selector: 'eligible-by-day-chart',
  templateUrl: './eligible-by-day.component.html',
  styleUrls: ['./eligible-by-day.component.scss'],
})
export class EligibleByDayComponent implements OnInit {
  eligibilityChartDatasets = [
    {
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: 'rgba(18,102,241,.3)',
      borderColor: '#1266f1',
    },
  ];

  eligibilityChartLabels: string[] = [];

  eligibilityChartOptions = {
    legend: {
      display: false,
    },
  };

  constructor() {}

  ngOnInit(): void {
    let result = new Array(10);
    result = result.fill(0).map(() => Math.random());
    this.eligibilityChartDatasets[0].data = result;

    let i = 10;

    while (i > 0) {
      let date = new Date();
      date.setDate(date.getDate() - i).toString();
      this.eligibilityChartLabels.push(
        `${MONTHS[date.getMonth()]} ${date.getDate()}`
      );
      i--;
    }
  }
}
