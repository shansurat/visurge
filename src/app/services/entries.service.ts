import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinct, distinctUntilChanged, map } from 'rxjs/operators';
import { getRegimenByCode } from '../functions/getRegimenByCode';
import { distinctUntilChangedObj } from '../functions/observable-functions';
import { Age } from '../interfaces/age';
import { FirestoreEntry } from '../interfaces/firestore-entry';
import { UserEntry } from '../interfaces/user-entry';
import { FacilitiesService } from './facilities.service';
import { StatusService } from './status.service';

interface BySex {
  male: any[];
  female: any[];
}

interface ByRegimen {
  TLD: any[];
  TLE: any[];
}

interface YesOrNo {
  yes: any[];
  no: any[];
}

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  getRegimenByCode = getRegimenByCode;

  all$ = new BehaviorSubject([] as any[]);

  allBySex$: BehaviorSubject<{ eligible: BySex; ineligible: BySex }> =
    new BehaviorSubject({} as { eligible: BySex; ineligible: BySex });

  allByRegimen$: BehaviorSubject<{
    eligible: ByRegimen;
    ineligible: ByRegimen;
  }> = new BehaviorSubject(
    {} as { eligible: ByRegimen; ineligible: ByRegimen }
  );

  allByPMTCT$: BehaviorSubject<{ eligible: YesOrNo; ineligible: YesOrNo }> =
    new BehaviorSubject({} as { eligible: YesOrNo; ineligible: YesOrNo });

  eligible$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  ineligible$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);

  hvl$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  hvl_eac3_completed_count$: BehaviorSubject<number> = new BehaviorSubject(0);
  pregnant$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  allByPending$: BehaviorSubject<{ eligible: YesOrNo; ineligible: YesOrNo }> =
    new BehaviorSubject({} as any);

  age$: BehaviorSubject<any> = new BehaviorSubject({} as any);

  entries_formatted$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  entries_formatted_count$: BehaviorSubject<any> = new BehaviorSubject(
    {} as any
  );

  constructor(
    private afs: AngularFirestore,
    private statusServ: StatusService,
    private fns: AngularFireFunctions,
    private facilitiesServ: FacilitiesService
  ) {
    afs
      .collection('entries')
      .valueChanges()
      .subscribe((entries) => {
        this.all$.next(entries as any[]);

        this.pregnant$.next(
          entries.filter((entry: any) => entry?.pmtct == 'yes')
        );

        this.hvl$.next(entries.filter((entry: any) => entry?.hvl == 'yes'));
      });

    afs
      .collection('entries')
      .valueChanges()
      .pipe(
        map((entries: any[]) => {
          return entries?.map((entry: FirestoreEntry) => {
            let {
              entryDate,
              pmtctEnrollStartDate,
              ARTStartDate,
              regimenStartTransDate,
              eac3CompletionDate,
              birthdate,
              nextViralLoadSampleCollectionDate,
              pendingStatusDate,
              pmtct,
              hvl,
              eac3Completed,
              vlh,
              cvh,
              eligibility,
              ...data
            } = entry;

            return {
              ARTStartDate: ARTStartDate.toDate(),
              birthdate: birthdate == undefined ? null : birthdate?.toDate(),
              eac3CompletionDate:
                eac3CompletionDate == undefined
                  ? null
                  : eac3CompletionDate?.toDate(),
              entryDate: entryDate.toDate(),
              pmtctEnrollStartDate:
                pmtctEnrollStartDate == undefined
                  ? null
                  : pmtctEnrollStartDate?.toDate(),
              regimenStartTransDate: regimenStartTransDate.toDate(),
              nextViralLoadSampleCollectionDate:
                nextViralLoadSampleCollectionDate.toDate(),
              pendingStatusDate:
                pendingStatusDate == undefined
                  ? null
                  : pendingStatusDate?.toDate(),
              pmtct: !!pmtct ? pmtct : 'no',
              hvl: !!hvl ? hvl : 'no',
              eac3Completed: !!eac3Completed ? eac3Completed : 'no',
              vlh: vlh.map((vl) => {
                let { dateSampleCollected, ...vlData } = vl;
                return {
                  dateSampleCollected: dateSampleCollected.toDate(),
                  ...vlData,
                };
              }),

              cvh: cvh.map((cv) => {
                let {
                  lastClinicVisitDate,
                  nextAppointmentDate,
                  dateTransferred,
                  ...cvData
                } = cv;

                return {
                  lastClinicVisitDate:
                    lastClinicVisitDate == undefined
                      ? null
                      : lastClinicVisitDate?.toDate(),
                  nextAppointmentDate:
                    nextAppointmentDate == undefined
                      ? null
                      : nextAppointmentDate?.toDate(),
                  dateTransferred:
                    dateTransferred == undefined
                      ? null
                      : dateTransferred?.toDate(),
                  ...cvData,
                };
              }),
              eligible: eligibility?.eligible,
              ...data,
            };
          });
        }, distinctUntilChangedObj())
      )
      .subscribe((entries_formatted) => {
        console.log({ entries_formatted });
        this.entries_formatted$.next(entries_formatted);
      });

    this.entries_formatted$
      .pipe(
        map((entries_formatted) => {
          const entries_formatted__eligible = entries_formatted.filter(
            (entry) => entry?.eligible
          );

          const entries_formatted__ineligible = entries_formatted.filter(
            (entry) => entry?.eligible
          );

          return {
            all: entries_formatted.length,
            eligible: {
              all: entries_formatted__eligible.length,
              iit: {
                active: entries_formatted__eligible.filter(
                  (entry) => entry?.iit == 'active'
                ).length,
                'iit <= 1': entries_formatted__eligible.filter(
                  (entry) => entry?.iit == 'iit <= 1'
                ).length,
                'iit <= 3': entries_formatted__eligible.filter(
                  (entry) => entry?.iit == 'iit <= 3'
                ).length,
                'iit > 3': entries_formatted__eligible.filter(
                  (entry) => entry?.iit == 'iit > 3'
                ).length,
                'transfer-out': entries_formatted__eligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Transfer Out'
                ).length,
                'transfer-in': entries_formatted__eligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Transfer In'
                ).length,
                dead: entries_formatted__eligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Dead'
                ).length,
                'follow-up': entries_formatted__eligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Lost-To-Follow-Up (IIT)'
                ).length,
              },
            },
            ineligible: {
              all: entries_formatted__eligible.length,
              iit: {
                active: entries_formatted__ineligible.filter(
                  (entry) => entry?.iit == 'active'
                ).length,
                'iit <= 1': entries_formatted__ineligible.filter(
                  (entry) => entry?.iit == 'iit <= 1'
                ).length,
                'iit <= 3': entries_formatted__ineligible.filter(
                  (entry) => entry?.iit == 'iit <= 3'
                ).length,
                'iit > 3': entries_formatted__ineligible.filter(
                  (entry) => entry?.iit == 'iit > 3'
                ).length,
                'transfer-out': entries_formatted__ineligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Transfer Out'
                ).length,
                'transfer-in': entries_formatted__ineligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Transfer In'
                ).length,
                dead: entries_formatted__ineligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Dead'
                ).length,
                'follow-up': entries_formatted__ineligible.filter(
                  (entry) =>
                    entry?.cvh[entry.cvh.length - 1].clinicVisitComment ==
                    'Lost-To-Follow-Up (IIT)'
                ).length,
              },
            },
          };
        })
      )
      .subscribe((entries_formatted_count) =>
        this.entries_formatted_count$.next(entries_formatted_count)
      );

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

    // All By Age$
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

    // Get Entries by Pending$
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
              yes: this.getEntriesByPending(eligible).male,
              no: this.getEntriesByPending(eligible).female,
            },
            ineligible: {
              yes: this.getEntriesByPending(ineligible).male,
              no: this.getEntriesByPending(ineligible).female,
            },
          };
        }),
        distinctUntilChangedObj()
      )
      .subscribe((allByPending) => {
        this.allByPending$.next(
          allByPending as { eligible: YesOrNo; ineligible: YesOrNo }
        );
      });

    // HVL with EAC3 Completed Count
    this.all$
      .pipe(
        map((entries) => {
          return entries.filter(
            (entry: any) =>
              entry?.eligibility?.eligible &&
              entry?.hvl == 'yes' &&
              entry?.eac3Completed == 'yes'
          ).length;
        }),
        distinctUntilChanged()
      )
      .subscribe((hvl_eac3_completed_count) => {
        this.hvl_eac3_completed_count$.next(hvl_eac3_completed_count);
      });
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

  public getEntriesByPMTCT(entries: any[]): YesOrNo {
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

  public getEntriesByPending(entries: any[]) {
    return {
      male: entries.filter((entry: any) => !!entry?.pendingStatusDate),
      female: entries.filter((entry: any) => !entry?.pendingStatusDate),
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

  public findEntries(
    id: string,
    filter = '',
    sortOrder = 'asc',
    pageNumber = [],
    pageSize = 3
  ): Observable<UserEntry[]> {
    const findEntries = this.fns.httpsCallable('findEntries');

    return findEntries('');
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
