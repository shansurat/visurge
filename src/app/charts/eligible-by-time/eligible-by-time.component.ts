import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take, takeWhile } from 'rxjs/operators';
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
  selector: 'eligible-by-time',
  templateUrl: './eligible-by-time.component.html',
  styleUrls: ['./eligible-by-time.component.scss'],
})
export class EligibleByTimeComponent implements OnInit {
  mode!: string;

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
      y: {
        ticks: {
          min: 0,
          stepSize: 1,
        },
      },
    },
  };

  eligibilityChartDatasets$ = new BehaviorSubject({} as any);

  eligibilityByDay$ = new BehaviorSubject([] as any[]);
  eligibilityByWeek$ = new BehaviorSubject([] as any[]);
  eligibilityByMonth$ = new BehaviorSubject([] as any[]);
  mode$ = new BehaviorSubject('day');

  constructor(private entriesServ: EntriesService, statusServ: StatusService) {
    // Should be moved to a service file!

    const _eligibilityByDay$ = entriesServ.all$.pipe(
      map((entries: any[]) => {
        let i = 12;
        let entriesByDay = [];

        while (i >= 0) {
          let _day = new Date();
          const day = new Date(_day.setDate(_day.getDate() - i));

          entriesByDay.push({
            day,
            entries: {
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
            },
          });

          i--;
        }
        return entriesByDay;
      })
    );

    _eligibilityByDay$.subscribe((eligibilityByDay) =>
      this.eligibilityByDay$.next(eligibilityByDay as any[])
    );

    const _eligibilityByWeek$ = entriesServ.all$.pipe(
      map((entries: any[]) => {
        let i = 12;
        let entriesByWeek = [];

        while (i >= 0) {
          const _day = new Date();
          const day = new Date(_day.setDate(_day.getDate() - i * 7));
          entriesByWeek.push({
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

          i--;
        }
        return entriesByWeek;
      })
    );

    _eligibilityByWeek$.subscribe((eligibilityByWeek) =>
      this.eligibilityByWeek$.next(eligibilityByWeek as any[])
    );

    const _eligibilityByMonth$ = entriesServ.all$.pipe(
      map((entries: any[]) => {
        let i = 12;
        let entriesByMonth = [];

        while (i >= 0) {
          const _day = new Date();
          const day = new Date(_day.setMonth(_day.getMonth() - i));
          console.log('day', day);
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

          i--;
        }
        return entriesByMonth;
      })
    );

    _eligibilityByMonth$.subscribe((eligibilityByMonth) =>
      this.eligibilityByMonth$.next(eligibilityByMonth as any[])
    );

    combineLatest(
      this.mode$,
      entriesServ.all$.pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
    )
      .pipe(
        map(([mode, all]) => {
          if (this.mode == mode) return;
          this.eligibilityChartLabels = [];

          if (mode == 'day') {
            this.eligibilityChartDatasets[0].data = this.eligibilityByDay$
              .getValue()
              .map((day: any) => day.entries.eligible.length);

            let i = 12;

            while (i >= 0) {
              let date = new Date();
              date.setDate(date.getDate() - i).toString();
              this.eligibilityChartLabels.push(
                `${MONTHS[date.getMonth()]} ${date.getDate()}`
              );
              i--;
            }
          } else if (mode == 'week') {
            this.eligibilityChartDatasets[0].data = this.eligibilityByWeek$
              .getValue()
              .map((week: any) => week.eligible.length);

            let i = 12;

            while (i >= 0) {
              const date = new Date();
              date.setDate(date.getDate() - i * 7).toString();

              this.eligibilityChartLabels.push(
                `${MONTHS[date.getMonth()]} ${date.getDate()}`
              );
              i--;
            }
          } else {
            this.eligibilityChartDatasets[0].data = this.eligibilityByMonth$
              .getValue()
              .map((month: any) => month.eligible.length);

            let i = 12;

            while (i >= 0) {
              const date = new Date();

              let m = date.getMonth() - i;

              if (m < 0) m += 12;

              this.eligibilityChartLabels.push(MONTHS[m]);
              i--;
            }
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}
}

function isSameDay(first: Date, second: Date) {
  if (!first || !second) return null;

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
