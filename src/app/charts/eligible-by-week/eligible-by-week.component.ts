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
  selector: 'eligible-by-week-chart',
  templateUrl: './eligible-by-week.component.html',
  styleUrls: ['./eligible-by-week.component.scss'],
})
export class EligibleByWeekComponent implements OnInit {
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

    let i = 10;

    while (i >= 0) {
      const date = new Date();
      const dateEnd = new Date();
      date.setDate(date.getDate() - i * 7).toString();

      dateEnd.setDate(date.getDate() + 7).toString();
      this.eligibilityChartLabels.push(
        `${MONTHS[date.getMonth()]} ${date.getDate()} - ${
          MONTHS[dateEnd.getMonth()]
        } ${dateEnd.getDate()}`
      );
      i--;
    }
  }
}
