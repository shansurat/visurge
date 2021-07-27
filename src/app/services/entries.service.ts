import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinct, distinctUntilChanged, map } from 'rxjs/operators';
import { getRegimenByCode } from '../functions/getRegimenByCode';
import { StatusService } from './status.service';

interface BySex {
  male: any[];
  female: any[];
}

interface ByRegimen {
  TLD: any[];
  TLE: any[];
}

interface ByPMTCT {
  yes: any[];
  no: any[];
}

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  all$ = new BehaviorSubject([] as any[]);

  allBySex$: BehaviorSubject<{ eligible: BySex; ineligible: BySex }> =
    new BehaviorSubject({} as { eligible: BySex; ineligible: BySex });

  allByRegimen$: BehaviorSubject<{
    eligible: ByRegimen;
    ineligible: ByRegimen;
  }> = new BehaviorSubject(
    {} as { eligible: ByRegimen; ineligible: ByRegimen }
  );

  allByPMTCT$: BehaviorSubject<{ eligible: ByPMTCT; ineligible: ByPMTCT }> =
    new BehaviorSubject({} as { eligible: ByPMTCT; ineligible: ByPMTCT });

  eligible$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  ineligible$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);

  hvl$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  hvl_eac3_completed$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  pregnant$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  pending$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);

  constructor(
    private afs: AngularFirestore,
    private statusServ: StatusService
  ) {
    afs
      .collection('entries')
      .valueChanges()

      .subscribe((entries) => {
        this.all$.next(entries as any[]);

        this.pregnant$.next(
          entries.filter((entry: any) => entry?.pmtct == 'yes')
        );

        this.pending$.next(
          entries.filter((entry: any) => !!entry?.pendingStatusDate)
        );
        this.hvl$.next(entries.filter((entry: any) => entry?.hvl == 'yes'));
        this.hvl_eac3_completed$.next(
          entries.filter(
            (entry: any) => entry?.hvl == 'yes' && entry?.eac3Completed == 'yes'
          )
        );
      });

    // All By Sex$
    this.all$
      .pipe(
        map((entries) => {
          const eligible = entries.filter(
            (entry: any) => entry?.eligibility?.eligible
          );
          const ineligible = entries.filter(
            (entry: any) => !entry?.eligibility?.eligible
          );

          return {
            eligible: {
              male: this.getEntriesBySex(eligible).male,
              female: this.getEntriesBySex(eligible).female,
            },
            ineligible: {
              male: this.getEntriesBySex(ineligible).male,
              female: this.getEntriesBySex(ineligible).female,
            },
          };
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((allBySex) => {
        this.allBySex$.next(allBySex);
      });

    // All By Regimen$
    this.all$
      .pipe(
        map((entries) => {
          const eligible = entries.filter(
            (entry: any) => entry?.eligibility?.eligible
          );
          const ineligible = entries.filter(
            (entry: any) => !entry?.eligibility?.eligible
          );

          return {
            eligible: {
              TLD: this.getEntriesByRegimen(eligible).TLD,
              TLE: this.getEntriesByRegimen(eligible).TLE,
            },
            ineligible: {
              TLD: this.getEntriesByRegimen(ineligible).TLD,
              TLE: this.getEntriesByRegimen(ineligible).TLE,
            },
          };
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((allByRegimen) => this.allByRegimen$.next(allByRegimen));

    this.all$
      .pipe(
        map((entries) => {
          const eligible = entries.filter(
            (entry: any) => entry?.eligibility?.eligible
          );
          const ineligible = entries.filter(
            (entry: any) => !entry?.eligibility?.eligible
          );

          return {
            eligible: {
              yes: this.getEntriesByPMTCT(eligible).yes,
              no: this.getEntriesByPMTCT(eligible).no,
            },
            ineligible: {
              yes: this.getEntriesByPMTCT(ineligible).yes,
              no: this.getEntriesByPMTCT(ineligible).no,
            },
          };
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((allByPMTCT) => this.allByPMTCT$.next(allByPMTCT));

    // Eligible Entries
    this.all$
      .pipe(
        map((entries) =>
          entries.filter((entry: any) => {
            const nextVLDate =
              entry.nextViralLoadSampleCollectionDate?.toDate();

            return statusServ.getEligibilityStatusByNextVLDate(
              nextVLDate,
              entry.hvl == 'yes',
              entry.eac3Completed == 'yes',
              entry.vlh
            ).eligible;
          })
        ),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((entries) => this.eligible$.next(entries));

    // Ineligible Entries
    this.all$
      .pipe(
        map((entries) =>
          entries.filter((entry: any) => {
            const nextVLDate =
              entry.nextViralLoadSampleCollectionDate?.toDate();

            return !statusServ.getEligibilityStatusByNextVLDate(
              nextVLDate,
              entry.hvl == 'yes',
              entry.eac3Completed == 'yes',
              entry.vlh
            ).eligible;
          })
        ),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((ineligible) => this.ineligible$.next(ineligible));
  }

  public getEntriesBySex(entries: any[]): BySex {
    return {
      male: entries.filter((entry: any) => entry.sex == 'male'),
      female: entries.filter((entry: any) => entry.sex != 'male'),
    };
  }

  public getEntriesByRegimen(entries: any[]): ByRegimen {
    return {
      TLD: entries.filter(
        (entry: any) => getRegimenByCode(entry?.regimen)?.category == 'TLD'
      ),
      TLE: entries.filter(
        (entry: any) => getRegimenByCode(entry?.regimen)?.category != 'TLD'
      ),
    };
  }

  public getEntriesByPMTCT(entries: any[]): ByPMTCT {
    return {
      yes: entries.filter((entry: any) => entry.pmtct == 'yes'),
      no: entries.filter((entry: any) => entry.pmtct != 'no'),
    };
  }
}

function isSameDay(first: Date, second: Date) {
  if (!first || !second) return null;

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
