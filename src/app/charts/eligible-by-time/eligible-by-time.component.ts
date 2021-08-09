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
    // borderWidth: 4,
    pointBackGroundColor: '#00B74A',
    pointHoverRadius: 8,
  };

  eligibilityChartDatasets = [
    {
      data: [''],
      ...this.datasetOptions,
    },
  ];

  eligibilityChartLabels: string[] = [];

  eligibilityChartOptions = {
    dataLabelsPlugin: true,

    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
      y: {
        grace: '5%',
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
        const _day = new Date();
        const days = dateRange(
          new Date(_day.setDate(_day.getDate() - 12)),
          new Date(),
          1
        );

        return days.map((day, i) => {
          return {
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
                  ).eligible && isSameDay(day, nextVLDate)
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
                  ).eligible && isSameDay(day, nextVLDate)
                );
              }),
            },
          };
        });
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
          const _day2 = new Date();
          const day = new Date(_day.setDate(_day.getDate() - i * 7));
          const day2 = new Date(_day2.setDate(_day2.getDate() - (i + 1) * 7));

          entriesByWeek.push({
            eligible: entries.filter((entry) => {
              const nextVLDate =
                entry.nextViralLoadSampleCollectionDate?.toDate() as Date;

              return (
                statusServ.getEligibilityStatusByNextVLDate(
                  nextVLDate,
                  entry.hvl == 'yes',
                  entry.eac3Completed == 'yes',
                  entry.vlh
                ).eligible &&
                diffDate(nextVLDate, day2) >= 0 &&
                diffDate(day, nextVLDate) >= 0
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
                ).eligible &&
                diffDate(day, nextVLDate) >= 0 &&
                diffDate(entry.entryDate.toDate(), day) <= 0
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
                ).eligible && day.getMonth() == nextVLDate.getMonth()
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
                ).eligible && day.getMonth() == nextVLDate.getMonth()
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
              const date2 = new Date();
              date2.setDate(date2.getDate() - (i - 1) * 7 - 1).toString();

              this.eligibilityChartLabels.push(
                `${MONTHS[date.getMonth()]} ${date.getDate()} - ${
                  MONTHS[date2.getMonth()]
                } ${date2.getDate()}`
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

function dateRange(startDate: Date, endDate: Date, steps = 1) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}
