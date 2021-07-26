import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facility } from '../interfaces/facility';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  facilities$: BehaviorSubject<Facility[]> = new BehaviorSubject(
    [] as Facility[]
  );

  constructor(private afs: AngularFirestore) {
    this.afs
      .collection('facilities')
      .valueChanges()
      .pipe(
        map((facilities) => this.facilities$.next(facilities as Facility[]))
      )
      .subscribe();
  }
}
