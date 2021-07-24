import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  all$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  eligible$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  hvl$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  hvl_eac3_completed$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  pregnant$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);
  pending$: BehaviorSubject<any[]> = new BehaviorSubject([{}]);

  constructor(private afs: AngularFirestore) {
    afs
      .collection('entries')
      .valueChanges()
      .subscribe((entries) => {
        this.all$.next(entries);
        this.eligible$.next(
          entries.filter((entry: any) => entry?.eligibility?.eligible)
        );
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
  }
}
