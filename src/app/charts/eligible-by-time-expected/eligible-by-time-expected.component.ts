import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { diffDate } from 'src/app/functions/diffDate';
import { EntriesService } from 'src/app/services/entries.service';
import { StatusService } from 'src/app/services/status.service';

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
  selector: 'eligible-by-time-expected',
  templateUrl: './eligible-by-time-expected.component.html',
  styleUrls: ['./eligible-by-time-expected.component.scss'],
})
export class EligibleByTimeExpectedComponent implements OnInit {
  datasetOptions = {
    label: 'Eligible',
    fill: true,
    fillColor: '#fff',
    backgroundColor: 'rgba(0,183,74,.3)',
    borderColor: '#00B74A',
  };

  eligibilityChartDatasets = [
    {
      data: [''],
      ...this.datasetOptions,
    },
  ];

  eligibilityChartLabels: string[] = [];

  eligibilityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        ticks: {
          min: 0,
          stepSize: 1,
        },
      },
    },
  };

  eligibilityChartDatasets$ = new BehaviorSubject({} as any);
  eligibilityByMonth$ = new BehaviorSubject([] as any[]);

  constructor(private entriesServ: EntriesService, statusServ: StatusService) {
    entriesServ.all$
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        map((entries: any[]) => {
          console.log('IM HERE');
          let i = 0;
          let entriesByMonth = [];

          while (i < 6) {
            const _day = new Date();
            const day = new Date(_day.setMonth(_day.getMonth() + i));
            entriesByMonth.push({
              eligible: entries.filter((entry) => {
                const nextVLDate =
                  entry.nextViralLoadSampleCollectionDate?.toDate();

                return (
                  statusServ.getEligibilityStatusByNextVLDate(
                    nextVLDate,
                    entry.hvl == 'yes',
                    entry.eac3Completed == 'yes',
                    entry.vlh
                  ).eligible &&
                  diffDate(day, nextVLDate) >= 0 &&
                  diffDate(entry.entryDate.toDate(), day) <= 0
                );
              }),
              ineligible: entries.filter((entry) => {
                const nextVLDate =
                  entry.nextViralLoadSampleCollectionDate?.toDate();

                return (
                  !statusServ.getEligibilityStatusByNextVLDate(
                    nextVLDate,
                    entry.hvl == 'yes',
                    entry.eac3Completed == 'yes',
                    entry.vlh
                  ).eligible && diffDate(day, nextVLDate) >= 0
                );
              }),
            });

            i++;
          }

          this.eligibilityChartDatasets[0].data = entriesByMonth.map(
            (month: any) => month.eligible.length
          );

          console.log(this.eligibilityChartDatasets[0].data);

          i = 0;
          this.eligibilityChartLabels = [];
          while (i < 6) {
            const date = new Date();

            let m = date.getMonth() - i;

            if (m < 0) m += 12;

            this.eligibilityChartLabels.push(MONTHS[m]);
            i++;
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}
}
