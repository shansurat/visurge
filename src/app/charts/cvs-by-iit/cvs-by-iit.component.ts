import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, zip } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'cvs-by-iit',
  templateUrl: './cvs-by-iit.component.html',
  styleUrls: ['./cvs-by-iit.component.scss'],
})
export class CvsByIitComponent implements OnInit {
  cvsChartDatasets = [
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

  entries$!: Observable<any[]>;
  cvs$!: Observable<number[]>;

  cvsChartLabels: string[] = ['Active', 'IIT ≤ 1', 'IIT ≤ 3', 'IIT 3⁺'];

  cvsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  showAllFormControl: FormControl = new FormControl(false);
  constructor(private afs: AngularFirestore) {
    this.entries$ = afs.collection('entries').valueChanges();

    const res$ = this.entries$.subscribe((entries) => {
      this.cvsChartDatasets = [
        {
          label: '',
          data: getCVS(entries),
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

      res$.unsubscribe();
    });
  }

  ngOnInit(): void {
    let i = 0;

    combineLatest(
      this.showAllFormControl.valueChanges,
      this.entries$
    ).subscribe(([showAllFormControl, entries]) => {
      if (showAllFormControl) {
        this.cvsChartDatasets = [
          {
            label: 'Eligible',
            data: getCVS(entries),
            fill: true,
            fillColor: '#fff',
            backgroundColor: [
              'rgba(0,183,74,1)',
              'rgba(255,235,59,1)',
              'rgba(255,169,0,1)',
              'rgba(249,49,84,1)',
            ],
          },
          {
            label: 'Ineligible',
            data: getCVS(entries, false),
            fill: true,
            fillColor: '#fff',
            backgroundColor: [
              'rgba(0,183,74,.3)',
              'rgba(255,235,59,.3)',
              'rgba(255,169,0,.3)',
              'rgba(249,49,84,.3)',
            ],
          },
        ];
      } else {
        this.cvsChartDatasets = [
          {
            label: '',
            data: getCVS(entries),
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
      }

      this.cvsChartLabels = ['Active', 'IIT ≤ 1', 'IIT ≤ 3', 'IIT 3⁺'];
    });

    // this.showAll(false);
  }

  showAll(val: boolean = true) {
    if (this.showAllFormControl.value == val) return;
    this.showAllFormControl.setValue(val);
  }
}

function getCVS(entries: any[], eligible: boolean = true) {
  const eligibles = entries.filter((entry) => entry.eligibility.eligible);
  const ineligibles = entries.filter((entry) => !entry.eligibility.eligible);

  const active = eligibles.filter((entry) => entry.iit == 'active').length;
  const iit_lt_1 = eligibles.filter((entry) => entry.iit == 'iit <= 1').length;
  const iit_lt_3 = eligibles.filter((entry) => entry.iit == 'iit <= 3').length;
  const iit_gt_3 = eligibles.filter((entry) => entry.iit == 'iit > 3').length;

  const active_i = ineligibles.filter((entry) => entry.iit == 'active').length;
  const iit_lt_1_i = ineligibles.filter(
    (entry) => entry.iit == 'iit <= 1'
  ).length;
  const iit_lt_3_i = ineligibles.filter(
    (entry) => entry.iit == 'iit <= 3'
  ).length;
  const iit_gt_3_i = ineligibles.filter(
    (entry) => entry.iit == 'iit > 3'
  ).length;

  return eligible
    ? [active, iit_lt_1, iit_lt_3, iit_gt_3]
    : [active_i, iit_lt_1_i, iit_lt_3_i, iit_gt_3_i];
}
