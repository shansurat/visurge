import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  zoomInEnterAnimation,
  zoomOutLeaveAnimation,
} from 'mdb-angular-ui-kit/animations';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { fields } from 'src/app/constants/entry-fields';
import { scrollConfig } from 'src/app/constants/scrollConfig';
import { ageToFirestoreAge, ageToText, getAge } from 'src/app/functions/getAge';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { timestampToDateForObj } from 'src/app/functions/timestampToDate';
import { Age } from 'src/app/interfaces/age';
import { FirestoreAge } from 'src/app/interfaces/firestore-age';
import { AreYouSureComponent } from 'src/app/modals/are-you-sure/are-you-sure.component';
import { EditEntryFacilityComponent } from 'src/app/modals/edit-entry-facility/edit-entry-facility.component';
import { ExportEntriesComponent } from 'src/app/modals/export-entries/export-entries.component';
import { ImportEntriesComponent } from 'src/app/modals/import-entries/import-entries.component';
import { ViewVlhComponent } from 'src/app/modals/view-vlh/view-vlh.component';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { ViewCVHService } from 'src/app/services/view-cvh.service';

interface Field {
  header: string;
  field: string;
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [zoomInEnterAnimation(), zoomOutLeaveAnimation()],
})
export class DatabaseComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table!: MdbTableDirective<any>;

  tableIsLoading = false;

  isAdvancedFiltersExpanded = false;

  scrollConfig = scrollConfig;

  getRegimenByCode = getRegimenByCode;

  fields = fields;

  advancedFilter = new BehaviorSubject(false);
  advancedActiveFilters$: BehaviorSubject<any> = new BehaviorSubject({} as any);

  filterFormControl = new FormControl();
  filter$: BehaviorSubject<string> = new BehaviorSubject('');
  currentAdvancedFilters!: any;

  entries$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  sortHeader$: BehaviorSubject<Field> = new BehaviorSubject(fields[0]);
  sortIsAscending$: BehaviorSubject<boolean> = new BehaviorSubject(
    true as boolean
  );

  constructor(
    private router: Router,
    private modalServ: MdbModalService,
    public authServ: AuthService,
    public entriesServ: EntriesService,
    public facilitiesServ: FacilitiesService,
    public viewCVHServ: ViewCVHService,
    private activatedRoute: ActivatedRoute
  ) {}

  getAge = getAge;
  ageToText = ageToText;

  ngOnInit(): void {
    this.filterFormControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((filter) => this.filter$.next(filter));
    combineLatest(
      this.entriesServ.entries_formatted$,
      this.advancedFilter,
      this.filter$,
      this.advancedActiveFilters$,
      this.sortHeader$.pipe(distinctUntilChanged()),
      this.sortIsAscending$.pipe(distinctUntilChanged())
    )
      .pipe(
        tap(() => (this.tableIsLoading = true)),
        map(
          ([
            entries,
            mode,
            filter,
            advancedFilters,
            sortHeader,
            sortIsAscending,
          ]) => {
            this.tableIsLoading = true;
            return this.sortEntries(
              [
                ...(mode
                  ? this.filterEntries_Advanced(entries, advancedFilters)
                  : this.filterEntries(entries, filter)),
              ],
              sortHeader.field,
              sortIsAscending
            );
          }
        ),
        tap(() => (this.tableIsLoading = false))
      )
      .subscribe((entries) => {
        this.entries$.next(entries);
      });
  }

  ngAfterViewInit() {
    const _activeFilters =
      this.activatedRoute.snapshot.paramMap.get('activeFilters');

    if (!!_activeFilters) {
      const activeFilters = JSON.parse(_activeFilters);
      this.advancedFilter.next(true);
      this.currentAdvancedFilters = activeFilters;
    }
  }

  get advancedActiveFiltersCount(): Observable<number> {
    return this.advancedActiveFilters$.pipe(
      map(
        (filters) =>
          Object.keys(filters).filter((key) => {
            if (key.includes('Date'))
              return !!filters[key]?.from || !!filters[key]?.from;
            else if (key == 'facility' || key == 'regimen')
              return !!(filters[key]?.value as any[])?.length;

            return !!filters[key]?.length;
          }).length
      )
    );
  }

  openImportEntriesModal() {
    this.modalServ.open(ImportEntriesComponent, {
      modalClass: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
  }

  openExportEntriesModal() {
    const exportEntriesModalRef = this.modalServ.open(ExportEntriesComponent, {
      modalClass: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
      data: { entries$: this.entries$ },
    });

    exportEntriesModalRef.onClose.subscribe((val) => console.log(val));
  }

  loadEntry(id: string) {
    this.router.navigate(['/entry-form', { id }]);
  }

  generateReport(UAN: string) {
    this.router.navigate(['/report', { UAN }]);
  }

  deleteEntry(id: string, UAN: string) {
    const areYouSureModalRef = this.modalServ.open(AreYouSureComponent, {
      modalClass: 'modal-dialog-centered',
      data: { title: 'Delete Data Entry', context: UAN },
      ignoreBackdropClick: true,
      keyboard: false,
    });

    areYouSureModalRef.onClose.subscribe((yes) => {
      if (yes) {
        this.entriesServ.deleteEntry(id);
      }
    });
  }

  filterEntries(entries: any[], filter: string) {
    if (!filter?.length) return [...entries];

    filter = filter.toLowerCase();

    return entries.filter((entry) => {
      return Object.keys(entry).some((key: any) => {
        if (!entry[key]) return false;

        switch (key) {
          case 'entryDate':
          case 'pmtctEnrollStartDate':
          case 'pendingStatusDate':
          case 'regimenStartTransDate':
          case 'ARTStartDate':
          case 'eac3CompletionDate':
            return formatDate(entry[key], 'longDate', 'en-US')
              .toLowerCase()
              .includes(filter);
          case 'sex':
          case 'pmtct':
          case 'hvl':
          case 'eac3Completed':
          case 'uniqueARTNumber':
            return entry[key].toLowerCase().includes(filter);
          case 'pendingStatus':
            return (!!entry.pendingStatusDate ? 'yes' : 'no').includes(filter);
          case 'eligible':
            return (entry.eligible ? 'yes' : 'no').includes(filter);
          case 'phoneNumber':
            return (entry[key] || 'unknown').includes(filter.toLowerCase());
          // case 'facility':
          //   return (
          //     await this.facilitiesServ
          //       .getFacilityById(entry[key])
          //       .toPromise()
          //   ).site.includes(filter.toLowerCase());
          case 'regimen':
            const reg = getRegimenByCode(entry[key]) as any;
            return Object.keys(reg).some((regKey) =>
              reg[regKey].toLowerCase().includes(filter)
            );
          case 'vlh':
          case 'cvh':
            return false;

          default:
            return false;
        }
      });
    });
  }

  filterEntries_Advanced(entries: any[], advancedFilters: any) {
    return entries.filter((entry: any) => {
      return Object.keys(advancedFilters).every((key) => {
        if (!advancedFilters[key]) return true;
        switch (key) {
          // Date Fields
          case 'entryDate':
          case 'pmtctEnrollStartDate':
          case 'pendingStatusDate':
          case 'regimenStartTransDate':
          case 'ARTStartDate':
          case 'eac3CompletionDate':
            if (entry[key]) {
              if (advancedFilters[key].from || advancedFilters[key].to) {
                const date = entry[key];
                const from = new Date(advancedFilters[key].from);
                const to = new Date(advancedFilters[key].to);

                return (
                  (!!advancedFilters[key].from ? date >= from : true) &&
                  (!!advancedFilters[key].to
                    ? to.setDate(to.getDate() + 1) >= date
                    : true)
                );
              }
              return true;
            }
            return !(advancedFilters[key].from || advancedFilters[key].to);
          // Normal Fields
          case 'uniqueARTNumber':
            return entry[key].includes(advancedFilters[key].toUpperCase());
          case 'iit':
            return advancedFilters[key].includes(entry[key]);
          case 'sex':
          case 'pmtct':
          case 'hvl':
          case 'eac3Completed':
            return entry[key] == advancedFilters[key];
          case 'pendingStatus':
            return !!entry.pendingStatusDate == (advancedFilters[key] == 'yes');
          case 'eligible':
            return entry.eligible == (advancedFilters[key] == 'yes');
          case 'phoneNumber':
            if (advancedFilters[key] == 'unknown') return !entry[key];
            return entry[key]?.includes(advancedFilters[key]);

          case 'facility':
            const facilities = advancedFilters[key] as any[];
            return facilities.length ? facilities.includes(entry[key]) : true;

          case 'regimen':
            const regimens = advancedFilters[key] as any[];
            return regimens.length ? regimens.includes(entry[key]) : true;
          default:
            return true;
        }
      });
    });
  }

  sortEntries(entries: any[], field: string, isAscending: boolean) {
    const sortedEntriesByAscending = entries.sort((A, B) => {
      switch (field) {
        case 'age':
          const age_A = (
            A.birthdate
              ? ageToFirestoreAge(getAge(A.birthdate) as Age)
              : A[field]
          ) as FirestoreAge;
          const age_B = (
            B.birthdate
              ? ageToFirestoreAge(getAge(B.birthdate) as Age)
              : B[field]
          ) as FirestoreAge;

          if (age_A.unit == age_B.unit) return age_A.age - age_B.age;
          switch (age_A.unit) {
            case 'year':
              return 1;
            case 'month':
              return age_B.unit == 'day' ? 1 : -1;
            default:
              return -1;
          }

        case 'sex':
        case 'phoneNumber':
        case 'regimen':
        case 'pmtct':
        case 'hvl':
        case 'eac3Completed':
        case 'iit':
          return A[field]?.localeCompare(B[field]);
        case 'pendingStatus':
          if (A.pendingStatusDate && !B.pendingStatusDate) return 1;
          else if (!A.pendingStatusDate && B.pendingStatusDate) return -1;
          return 0;
        case 'eligibility':
          if (A.eligible && !B.eligible) return 1;
          else if (!A.eligible && B.eligible) return -1;
          return 0;

        default:
          if (A[field] && !B[field]) return 1;
          else if (!A[field] && B[field]) return -1;
          else if (!A[field] && !B[field]) return 0;
          return A[field] - B[field];
      }
    });

    return isAscending
      ? sortedEntriesByAscending
      : sortedEntriesByAscending.reverse();
  }

  sortByHeader(field: Field) {
    if (this.sortHeader$.getValue() == field)
      this.sortIsAscending$.next(!this.sortIsAscending$.getValue());
    else this.sortHeader$.next(field);
  }

  updateAdvancedFilters(val: any) {
    this.advancedActiveFilters$.next(val);
  }

  viewVLH(vlh: any[]) {
    this.modalServ.open(ViewVlhComponent, {
      data: {
        vlh: (vlh as any[]).map((vl) => timestampToDateForObj(vl)),
      },
      modalClass:
        'modal-dialog-centered modal-lg modal-fullscreen-md-down modal-dialog-scrollable',
    });
  }

  viewCVH(cvh: any[]) {
    const _cvh = (cvh as any[]).map((cv) => timestampToDateForObj(cv));
    this.viewCVHServ.viewCVH(_cvh);
  }

  openEditEntryFacilityModal(id: string, facilityId?: string) {
    let editEntryFacilityModalRef = this.modalServ.open(
      EditEntryFacilityComponent,
      {
        data: { id, facilityId },
        modalClass: 'modal-dialog-centered',
      }
    );

    editEntryFacilityModalRef.onClose.subscribe((facility) => {
      this.tableIsLoading = true;
      if (facility)
        this.entriesServ
          .updateEntryFacility(id, facility)
          .then(() => (this.tableIsLoading = false));
    });
  }
}

// function isSameDay(first: Date, second: Date): boolean {
//   return (
//     first.getFullYear() === second.getFullYear() &&
//     first.getMonth() === second.getMonth() &&
//     first.getDate() === second.getDate()
//   );
// }
