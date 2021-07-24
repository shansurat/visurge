import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
} from 'rxjs/operators';
import { UANToId } from 'src/app/functions/UANToID';
import { UserEntry } from 'src/app/interfaces/user-entry';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  public entriesAutocomplete$!: Observable<any[]>;
  public uniqueARTNumberFormControl: FormControl = new FormControl('');
  public selectedEntry$!: Observable<any>;

  constructor(private afs: AngularFirestore) {
    let UAN$: Observable<string> =
      this.uniqueARTNumberFormControl.valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged()
      );

    // Entries Autocomplete for UAN
    this.entriesAutocomplete$ = UAN$.pipe(
      mergeMap(async (UAN: string) => {
        return (
          await this.afs.collection('entries').get().toPromise()
        ).docs.filter((entry) =>
          (entry.data() as UserEntry).uniqueARTNumber.includes(
            UAN.toUpperCase()
          )
        );
      })
    );
    this.selectedEntry$ = UAN$.pipe(
      mergeMap((UAN: string): any => {
        console.log(UANToId(UAN));
        return UAN
          ? this.afs.collection('entries').doc(UANToId(UAN)).get()
          : of(null);
      }),
      map((entry: DocumentSnapshot<any> | any) => {
        return entry?.data();
      })
    );
  }

  ngOnInit(): void {}
}
