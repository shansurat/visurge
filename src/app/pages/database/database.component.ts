import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  fadeInLeftEnterAnimation,
  fadeOutLeftLeaveAnimation,
  slideInLeftEnterAnimation,
  slideOutLeftLeaveAnimation,
  zoomInEnterAnimation,
  zoomOutLeaveAnimation,
} from 'mdb-angular-ui-kit/animations';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import {
  MdbTableDirective,
  MdbTablePaginationComponent,
} from 'mdb-angular-ui-kit/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { diffDate } from 'src/app/functions/diffDate';
import { ageToText, getAge } from 'src/app/functions/getAge';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { timestampToDateForObj } from 'src/app/functions/timestampToDate';
import { ImportEntriesComponent } from 'src/app/modals/import-entries/import-entries.component';
import { NewAdvancedActiveFilterComponent } from 'src/app/modals/new-advanced-active-filter/new-advanced-active-filter.component';
import { ViewVlhComponent } from 'src/app/modals/view-vlh/view-vlh.component';
import { AuthService } from 'src/app/services/auth.service';
import { EntriesService } from 'src/app/services/entries.service';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { ViewCVHService } from 'src/app/services/view-cvh.service';

interface ActiveFilter {
  header: string;
  value: any;
  type?: string;
}

const fields = [
  { header: 'Entry Date', field: 'entryDate' },
  { header: 'Facility', field: 'facility' },
  { header: 'Unique ART Number', field: 'uniqueARTNumber' },
  { header: 'ART Start Date', field: 'ARTStartDate' },
  { header: 'Sex', field: 'sex' },
  { header: 'Age', field: 'age' },
  { header: 'Phone Number', field: 'phoneNumber' },
  { header: 'Regimen', field: 'regimen' },
  { header: 'Start/ Transition Date', field: 'regimenStartTransDate' },
  { header: 'Pregnant/Breastfeeding', field: 'pmtct' },
  { header: 'PMTCT Enrollment Start Date', field: 'pmtctEnrollStartDate' },
  { header: 'High Viral Load', field: 'hvl' },
  { header: 'EAC-3 Completed', field: 'eac3Completed' },
  { header: 'EAC-3 Completion Date', field: 'eac3CompletionDate' },
  { header: 'Pending Status', field: 'pendingStatus' },
  { header: 'Pending Status Date', field: 'pendingStatusDate' },
  { header: 'Eligibility', field: 'eligibility' },
];

function getFieldByHeader(header: string): string {
  return fields.find((field) => field.header == header)?.field || '';
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

  config = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  getRegimenByCode = getRegimenByCode;

  headers = [
    'Entry Date',
    'Facility',
    'Unique ART Number',
    'ART Start Date',
    'Sex',
    'Age',
    'Phone Number',
    'Regimen',
    'Start/ Transition Date',
    'Pregnant/Breastfeeding',
    'PMTCT Enrollment Start Date',
    'High Viral Load',
    'EAC-3 Completed',
    'EAC-3 Completion Date',
    'Pending Status',
    'Pending Status Date',
    'Eligibility',
    'Actions',
  ];

  advancedFilter = new BehaviorSubject(false);

  advancedActiveFilters$: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject(
    [] as ActiveFilter[]
  );

  filterFormControl = new FormControl();

  constructor(
    private afs: AngularFirestore,
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
    this.advancedActiveFilters$.subscribe((activeFilters) => {
      if (activeFilters.length) this.advancedFilter.next(true);
      this.advancedSearch(activeFilters);
    });

    this.advancedFilter.subscribe((val) => {
      if (!val) this.search();
    });
  }

  ngAfterViewInit() {
    const _activeFilters =
      this.activatedRoute.snapshot.paramMap.get('activeFilters');

    if (!!_activeFilters) {
      const activeFilters = JSON.parse(_activeFilters);
      this.advancedActiveFilters$.next(activeFilters);
    }
  }

  openImportEntriesModal() {
    this.modalServ.open(ImportEntriesComponent, {
      modalClass: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      keyboard: false,
    });
  }

  loadEntry(UAN: string) {
    this.router.navigate(['/entry-form', { UAN }]);
  }

  generateReport(UAN: string) {
    this.router.navigate(['/report', { UAN }]);
  }

  search() {
    this.table?.search(this.filterFormControl.value);
  }

  advancedSearch(activeFilters: ActiveFilter[]) {
    this.table?.search(JSON.stringify(activeFilters || ''));
  }

  filterFn(data: any, searchTerm: string): boolean {
    if (!searchTerm) return true;

    // tslint:disable-next-line: prefer-const
    let [phrase, columns] = searchTerm.split(' in:').map((str) => str.trim());
    return Object.keys(data).some((key: any) => {
      if (columns?.length) {
        let result;
        columns.split(',').forEach((column) => {
          if (
            column.toLowerCase().trim() === key.toLowerCase() &&
            data[key].toLowerCase().includes(phrase.toLowerCase())
          ) {
            result = true;
          }
        });
        return result;
      }
      if (data[key] && !columns?.length) {
        return JSON.stringify(data)
          .toLowerCase()
          .includes(phrase.toLowerCase());
      }

      return false;
    });
  }

  advancedFilterFn(data: any, searchTerm: string): boolean {
    if (!searchTerm) return true;

    const activeFilters = JSON.parse(searchTerm) as ActiveFilter[];

    return activeFilters.every((activeFilter) => {
      const { header, value, type } = activeFilter;
      const field = getFieldByHeader(header);

      switch (header) {
        // Normal Fields
        case 'Unique ART Number':
          return data.uniqueARTNumber.includes(value);
        case 'Sex':
        case 'Pregnant/Breastfeeding':
        case 'High Viral Load':
        case 'EAC-3 Completed':
          return data[field] == value;
        case 'Pending Status':
          return !!data.pendingStatusDate == (value == 'yes');
        case 'Eligibility':
          return data.eligibility.eligible == (value == 'eligible');

        // Date Fields
        case 'Entry Date':
        case 'PMTCT Enrollment Start Date':
        case 'Pending Status Date':
        case 'Start/ Transition Date':
        case 'ART Start Date':
          const date = data[field].toDate();
          const valueDate = new Date(value);
          switch (type) {
            case 'after':
              return date >= valueDate;
            case 'before':
              return date <= valueDate;
            default:
              return isSameDay(date, valueDate);
          }
        default:
          return false;
      }
    });
  }

  openNewAdvancedActiveFilterModal() {
    const newAdvancedActiveFilter = this.modalServ.open(
      NewAdvancedActiveFilterComponent,
      {
        modalClass: 'modal-dialog-centered modal-sm',
        data: {
          currentActiveFilters: this.advancedActiveFilters$.getValue(),
        },
      }
    );

    newAdvancedActiveFilter.onClose.subscribe((newFilter) => {
      if (newFilter) {
        console.log(newFilter);
        this.advancedActiveFilters$.next([
          ...this.advancedActiveFilters$.getValue(),
          newFilter,
        ]);
      }
    });
  }

  removeActiveFilter(filter: ActiveFilter) {
    let _activeFilters = new Set(this.advancedActiveFilters$.getValue());
    _activeFilters.delete(filter);

    this.advancedActiveFilters$.next([..._activeFilters.values()]);
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
}

function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
