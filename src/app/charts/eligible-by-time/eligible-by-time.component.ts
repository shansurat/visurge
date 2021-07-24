import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';

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
  selector: 'eligible-by-time',
  templateUrl: './eligible-by-time.component.html',
  styleUrls: ['./eligible-by-time.component.scss'],
})
export class EligibleByTimeComponent implements OnInit {
  mode!: string;

  eligibilityChartDatasets = [
    {
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: 'rgba(0,183,74,.3)',
      borderColor: '#00B74A',
    },
  ];

  eligibilityChartLabels: string[] = [];

  eligibilityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.setMode('day');
  }

  setMode(mode: string) {
    if (this.mode == mode) return;

    this.mode = mode;
    this.eligibilityChartLabels = [];

    if (mode == 'day') {
      let result = new Array(14);
      result = result.fill(0).map(() => Math.random());
      this.eligibilityChartDatasets[0].data = result;

      let i = 14;

      while (i > 0) {
        let date = new Date();
        date.setDate(date.getDate() - i).toString();
        this.eligibilityChartLabels.push(
          `${MONTHS[date.getMonth()]} ${date.getDate()}`
        );
        i--;
      }
    } else if (mode == 'week') {
      let result = new Array(13);
      result = result.fill(0).map(() => Math.random());
      this.eligibilityChartDatasets[0].data = result;

      let i = 13;

      while (i > 0) {
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
    } else {
      let result = new Array(12);
      result = result.fill(0).map(() => Math.random());
      this.eligibilityChartDatasets[0].data = result;

      this.eligibilityChartLabels = [];

      let i = 12;

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
}
