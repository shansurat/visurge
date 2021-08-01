import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinct, distinctUntilChanged, map } from 'rxjs/operators';
import { getRegimenByCode } from '../functions/getRegimenByCode';
import { distinctUntilChangedObj } from '../functions/observable-functions';
import { Age } from '../interfaces/age';
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

  hvl$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  hvl_eac3_completed$: BehaviorSubject<any[]> = new BehaviorSubject(
    [] as any[]
  );
  pregnant$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  pending$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  age$: BehaviorSubject<any> = new BehaviorSubject({} as any);

  constructor(
    private afs: AngularFirestore,
    private statusServ: StatusService,
    private fns: AngularFireFunctions
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
        distinctUntilChangedObj()
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
        distinctUntilChangedObj()
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
        distinctUntilChangedObj()
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
        distinctUntilChangedObj()
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
        distinctUntilChangedObj()
      )
      .subscribe((ineligible) => this.ineligible$.next(ineligible));

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
            eligible: this.getEntriesByAge(eligible),
            ineligible: this.getEntriesByAge(ineligible),
          };
        }),
        distinctUntilChangedObj()
      )
      .subscribe((age) => this.age$.next(age));
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

  public getEntriesByAge(entries: any[]) {
    return {
      '<1': filterEntriesByAge(entries, 1, undefined),
      '1-9': filterEntriesByAge(entries, 1, 9),
      '10-14': filterEntriesByAge(entries, 10, 14),
      '15-19': filterEntriesByAge(entries, 15, 19),
      '20-24': filterEntriesByAge(entries, 20, 24),
      '25-29': filterEntriesByAge(entries, 25, 29),
      '30-34': filterEntriesByAge(entries, 30, 34),
      '35-39': filterEntriesByAge(entries, 35, 39),
      '40-49': filterEntriesByAge(entries, 40, 49),
      '50+': filterEntriesByAge(entries, undefined, 50),
    };
  }

  // Get Individual Entry

  public getEntry$(UAN: string) {
    return this.all$.pipe(
      map((all) => all.find((entry) => entry.uniqueARTNumber == UAN))
    );
  }

  public getEntryId$(UAN: string) {
    return this.getEntry$(UAN).pipe(map((entry: any) => entry.id));
  }
}

function filterEntriesByAge(entries: any[], age1?: number, age2?: number) {
  if (!age2) return entries.filter((entry: any) => entry.age.unit != 'year');

  if (!age1)
    return entries.filter(
      (entry: any) => entry.age.unit != 'year' && entry.age.age >= 50
    );

  return entries.filter(
    (entry: any) =>
      entry.age.unit == 'year' &&
      entry.age?.age >= age1 &&
      entry.age?.age <= age2
  );
}
