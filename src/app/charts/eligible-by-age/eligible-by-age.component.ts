import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChangedObj } from 'src/app/functions/observable-functions';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'eligible-by-age',
  templateUrl: './eligible-by-age.component.html',
  styleUrls: ['./eligible-by-age.component.scss'],
})
export class EligibleByAgeComponent implements OnInit {
  datasets = [
    {
      label: 'Eligible',
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: [
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
      ],
    },
    {
      label: 'Ineligible',
      data: [''],
      fill: true,
      fillColor: '#fff',
      backgroundColor: [
        'rgba(244,67,54,.3)',
        'rgba(233,30,99,.3)',
        'rgba(156,39,176,.3)',
        'rgba(103,58,183,.3)',
        'rgba(63,81,181,.3)',
        'rgba(30,136,229,.3)',
        'rgba(2,136,209,.3)',
        'rgba(0,151,167,.3)',
        'rgba(38,166,154,.3)',
        'rgba(67,160,71,.3)',
      ],
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
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(public entriesServ: EntriesService) {
    entriesServ.age$.pipe(distinctUntilChangedObj()).subscribe((age) => {
      let e: any[] = [];
      Object.values(age.eligible).forEach((entries: any) =>
        e.push(entries.length)
      );
      this.datasets[0].data = e;

      let i: any[] = [];
      Object.values(age.ineligible).forEach((entries: any) =>
        i.push(entries.length)
      );
      this.datasets[1].data = i;

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
