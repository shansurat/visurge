import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { fields } from 'src/app/constants/entry-fields';
import * as XLSX from 'xlsx';
import { ExportEntriesPreviewComponent } from './export-entries-preview/export-entries-preview.component';

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
    private fb: FormBuilder
  ) {
    this.exportEntriesConfigFormGroup = fb.group({
      headers: '',
    });
  }
  entries$!: BehaviorSubject<any[]>;
  fields = fields;

  ngOnInit(): void {
    combineLatest(this.entries$, this.headers.valueChanges)
      .pipe(
        map(([entries, headers]) => {
          this.sanitizedEntries$.next(
            [...entries].map((_entry: any) => {
              let entry: any = {} as any;

              for (let field in _entry) {
                if (
                  (headers as any[]).find((header) => header.field == field)
                ) {
                  entry[field] = +entry[field];
                }
              }

              return entry;
            })
          );
        })
      )
      .subscribe();
  }

  get headers() {
    return this.exportEntriesConfigFormGroup.get('headers') as FormControl;
  }

  previewEntries() {
    this.modalServ.open(ExportEntriesPreviewComponent, {
      data: { data: this.sanitizedEntries$, headers: this.headers.value },
    });
  }

  exportEntries() {
    this.entries$.pipe(take(1)).subscribe((_entries) => {
      const entries = _entries.map((_entry) => {
        let entry: any = {} as any;

        for (let key in _entry) {
          console.log(key);
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
    });
  }
}
