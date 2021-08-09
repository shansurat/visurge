import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { regimens } from 'src/app/constants/regimens';
import { ActiveFilter } from 'src/app/interfaces/active-filter';
import { Regimen } from 'src/app/interfaces/regimen';
import { EntriesService } from 'src/app/services/entries.service';

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
})
export class DashboardComponent implements OnInit {
  entries$!: Observable<any[]>;
  eligible$!: Observable<any[]>;
  pregnant$!: Observable<any[]>;
  pending$!: Observable<any[]>;

  constructor(
    private afs: AngularFirestore,
    public entriesServ: EntriesService,
    private router: Router
  ) {
    this.entries$ = afs.collection('entries').valueChanges();
    this.eligible$ = this.entries$.pipe(
      map((entries) => {
        return entries.filter((entry: any) => entry?.eligibility?.eligible);
      })
    );

    this.pregnant$ = this.entries$.pipe(
      map((entries) => {
        return entries.filter((entry: any) => entry?.pmtct == 'yes');
      })
    );

    this.pending$ = this.entries$.pipe(
      map((entries) =>
        entries.filter((entry: any) => !!entry?.pendingStatusDate)
      )
    );
  }

  ngOnInit(): void {}

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
