import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eligible-by-age',
  templateUrl: './eligible-by-age.component.html',
  styleUrls: ['./eligible-by-age.component.scss'],
})
export class EligibleByAgeComponent implements OnInit {
  datasets = [
    {
      label: '',
      data: [0, 0, 0, 0],
      fill: true,
      fillColor: '#fff',
      backgroundColor: [
        'rgba(0,183,74,1)',
        'rgba(255,235,59,1)',
        'rgba(255,169,0,1)',
        'rgba(249,49,84,1)',
      ],
    },
  ];

  labels: string[] = ['Active', 'IIT ≤ 1', 'IIT ≤ 3', 'IIT 3⁺'];

  options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: 'y',
  };
  constructor() {}

  ngOnInit(): void {}
}
