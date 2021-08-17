import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Facility } from '../interfaces/facility';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  facilities$: BehaviorSubject<Facility[]> = new BehaviorSubject(
    [] as Facility[]
  );

  states$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());

  constructor(private afs: AngularFirestore) {
    this.afs
      .collection('facilities')
      .valueChanges()
      .pipe(
        map((facilities) => this.facilities$.next(facilities as Facility[]))
      )
      .subscribe();

    this.facilities$
      .pipe(
        map((facilities) =>
          this.states$.next(new Set(facilities.map((fac) => fac.state)))
        )
      )
      .subscribe();
  }

  getFacilityById(uid?: string): Observable<Facility> {
    return this.facilities$.pipe(
      map(
        (facilities) =>
          facilities.find((facility) => facility.uid == uid) as Facility
      )
    );
  }

  getFacilityByUAN(UAN?: string): Observable<Facility> {
    return this.afs
      .collection('users', (ref) =>
        ref.where('uniqueARTNumber', '==', UAN).limit(1)
      )
      .get()
      .pipe(
        map((res) => {
          const docs = res.docs;
          if (docs.length) return (docs[0] as any).data()?.facility;
        }),
        mergeMap((id: string) => {
          return this.getFacilityById(id);
        })
      );
  }
}
