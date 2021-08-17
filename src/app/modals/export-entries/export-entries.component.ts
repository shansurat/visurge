import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { fields } from 'src/app/constants/entry-fields';
import * as XLSX from 'xlsx';
import { ExportEntriesPreviewComponent } from './export-entries-preview/export-entries-preview.component';
import { formatDate } from '@angular/common';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { getAge } from 'src/app/functions/getAge';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-export-entries',
  templateUrl: './export-entries.component.html',
  styleUrls: ['./export-entries.component.scss'],
})
export class ExportEntriesComponent implements OnInit {
  exportEntriesConfigFormGroup!: FormGroup;

  sanitizedEntries$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  constructor(
    private modalServ: MdbModalService,
    public modalRef: MdbModalRef<ExportEntriesComponent>,
    private fb: FormBuilder,
    private facilitiesServ: FacilitiesService
  ) {
    this.exportEntriesConfigFormGroup = this.fb.group({
      headers: [[], [Validators.required]],
    });
  }
  entries$!: BehaviorSubject<any[]>;
  fields = fields;

  ngOnInit(): void {
    combineLatest(
      this.entries$,
      this.headers.valueChanges,
      this.facilitiesServ.facilities$
    )
      .pipe(
        map(([entries, headers, facilities]) => {
          (headers as any[]).sort(
            (A, B) => fields.indexOf(A) - fields.indexOf(B)
          );

          if (entries.length) {
            const filteredEntries = [...entries].map((_entry: any) => {
              let entry: any = {} as any;

              for (let field in _entry) {
                if ((headers as any[]).find((header) => header.field == field))
                  entry[field] = _entry[field];

                if (['sex', 'pmtct', 'hvl', 'eac3Completed'].includes(field)) {
                  const value = entry[field] as string;
                  entry[field] =
                    value?.substr(0, 1).toUpperCase() +
                    value?.substr(1).toLowerCase();
                } else if (field == 'facility') {
                  entry[field] = entry[field]
                    ? facilities.find(
                        (facility) => facility.code == entry[field]
                      )?.site
                    : 'Not Provided';
                } else if (field == 'phoneNumber' && !entry[field]) {
                  entry[field] = 'Unknown';
                } else if (
                  [
                    'pendingStatusDate',
                    'pmtctEnrollStartDate',
                    'eac3CompletionDate',
                  ].includes(field) &&
                  !entry[field]
                ) {
                  entry[field] = 'Not Applicable';
                } else if (field == 'regimen') {
                  entry[field] = getRegimenByCode(entry[field])?.regimen;
                } else if (field == 'age') {
                  entry[field] = `${entry[field]?.age} ${entry[field]?.unit}${
                    entry[field]?.age > 1 ? 's' : ''
                  } old`;
                } else if (field == 'iit') {
                  const iit = entry[field] as string;
                  entry[field] =
                    iit == 'active'
                      ? 'Active'
                      : ['iit <= 1', 'iit <= 3'].includes(iit)
                      ? iit.toUpperCase().replace('<=', '≤')
                      : 'IIT 3⁺';
                }

                entry.pendingStatus =
                  entry.pendingStatusDate != 'Not Applicable' ? 'Yes' : 'No';

                entry.eligibility = entry.eligible ? 'Eligible' : 'Ineligible';
              }

              return entry;
            });

            filteredEntries.map((entry) => {
              for (let field in entry) {
                if (entry[field] instanceof Date) {
                  entry[field] = formatDate(entry[field], 'longDate', 'en-US');
                }
              }
            });

            this.sanitizedEntries$.next(filteredEntries);
          }
        })
      )
      .subscribe();

    this.headers.setValue(fields);
  }

  get headers() {
    return this.exportEntriesConfigFormGroup.get('headers') as FormControl;
  }

  previewEntries() {
    this.modalServ.open(ExportEntriesPreviewComponent, {
      data: { data: this.sanitizedEntries$, headers: this.headers.value },
      modalClass:
        'modal-dialog-scrollable modal-dialog-centered modal-xl modal-container',
    });
  }

  exportEntries() {
    this.sanitizedEntries$.pipe(take(1)).subscribe((_entries) => {
      const entries = _entries.map((_entry) => {
        let entry: any = {} as any;

        for (let key in _entry) {
          if (['id', 'cvh', 'vlh', 'birthdate'].includes(key)) continue;

          entry[fields.find((field) => field.field == key)?.header as string] =
            _entry[key];
        }

        return entry;
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(entries);
      XLSX.utils.book_append_sheet(workbook, worksheet);

      XLSX.writeFile(workbook, 'entries.xlsx');

      this.modalRef.close();
    });
  }
}
