import { Component, OnInit } from '@angular/core';
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
  selector: 'eligible-by-month-chart',
  templateUrl: './eligible-by-month.component.html',
  styleUrls: ['./eligible-by-month.component.scss'],
})
export class EligibleByMonthComponent implements OnInit {
  eligibilityChartDatasets = [
    {
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: 'rgba(18,102,241,.3)',
      borderColor: '#1266f1',
    },
  ];

  eligibilityChartLabels: any = [];

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

    this.eligibilityChartLabels = [];

    let i = 10;

    while (i > 0) {
      const date = new Date();
      const dateEnd = new Date();

      let m = date.getMonth() - i;

      if (m < 0) m += 12;

      this.eligibilityChartLabels.push(MONTHS[m]);
      i--;
    }
  }
}
