import { FactoryTarget } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { states } from 'src/app/constants/states';
import { distinctUntilChangedObj } from 'src/app/functions/observable-functions';
import { ActiveFilter } from 'src/app/interfaces/active-filter';
import { Facility } from 'src/app/interfaces/facility';
import { ComponentsService } from 'src/app/services/components.service';
import { EntriesService } from 'src/app/services/entries.service';
import { FacilitiesService } from 'src/app/services/facilities.service';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  statesFormControl = new FormControl('', [Validators.required]);
  facilitiesFormControl = new FormControl('', [Validators.required]);

  statesSelected$: BehaviorSubject<string[]> = new BehaviorSubject([] as any[]);
  facilitySelected$: BehaviorSubject<string[]> = new BehaviorSubject(
    [] as string[]
  );

  states = states;
  facilities$: BehaviorSubject<Facility[]> = new BehaviorSubject(
    [] as Facility[]
  );

  filteredEntries$ = new BehaviorSubject([] as any[]);

  constructor(
    public entriesServ: EntriesService,
    private router: Router,
    public facilitiesServ: FacilitiesService,
    public compService: ComponentsService,
    private fns: AngularFireFunctions
  ) {
    this.statesFormControl.valueChanges
      .pipe(
        distinctUntilChangedObj(),
        map((states: string[]) => {
          this.statesSelected$.next(states);
          this.facilitiesServ.facilities$
            .pipe(take(1))
            .subscribe((facilities) =>
              this.facilitiesFormControl.setValue(
                facilities
                  .filter((facility) => states.includes(facility.state))
                  .map((facility) => facility.uid)
              )
            );
        })
      )
      .subscribe();

    this.facilitiesFormControl.valueChanges
      .pipe(
        distinctUntilChangedObj(),
        map((facilities: string[]) => this.facilitySelected$.next(facilities))
      )
      .subscribe();

    combineLatest(
      this.statesFormControl.valueChanges.pipe(distinctUntilChanged()),
      facilitiesServ.facilities$
    )
      .pipe(
        map(([statesSelected, allFacilities]) => {
          this.facilities$.next(
            allFacilities.filter((facility) =>
              (statesSelected as string[]).includes(facility.state)
            )
          );
        })
      )
      .subscribe();

    combineLatest(this.facilitySelected$, entriesServ.all$)
      .pipe(
        map(([selectedFacilities, allEntries]) =>
          allEntries.filter((entry) =>
            selectedFacilities.includes(entry.facility)
          )
        )
      )
      .subscribe((entries) => this.filteredEntries$.next(entries));
  }

  ngOnInit(): void {
    this.statesFormControl.setValue(this.states);
    this.facilitiesServ.facilities$.pipe(take(1)).subscribe((facilities) => {
      this.facilitiesFormControl.setValue(
        facilities.map((facility) => facility.uid)
      );
    });
  }

  genLinelist(e: MouseEvent, mode: string) {
    e.stopPropagation();
    let activeFilters = {} as any;

    activeFilters.eligible = 'yes';

    if (mode == 'pmtct') {
      activeFilters.pmtct = 'yes';
    } else if (mode == 'hvl-with-eac3') {
      activeFilters.hvl = 'yes';
      activeFilters.eac3Completed = 'yes';
    } else if (mode == 'pending') {
      activeFilters.pendingStatus = 'yes';
    }

    this.router.navigate([
      '/database',
      { activeFilters: JSON.stringify(activeFilters) },
    ]);
  }

  r(n: number) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
}
