import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { execFile } from 'child_process';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserEntry } from 'src/app/interfaces/user-entry';
import { StatusService } from 'src/app/services/status.service';
import * as XLSX from 'xlsx';
import { ImportEntriesPreviewComponent } from '../import-entries-preview/import-entries-preview.component';

interface ExcelFileInfo {
  sheets: XLSX.WorkSheet;
}

@Component({
  selector: 'app-import-entries',
  templateUrl: './import-entries.component.html',
  styleUrls: ['./import-entries.component.scss'],
})
export class ImportEntriesComponent implements OnInit {
  entriesFormControl = new FormControl();
  excelFile$ = new Subject<XLSX.WorkBook>();
  excelFileInfo$ = new Subject<ExcelFileInfo>();

  convertedData$ = new BehaviorSubject<any>([]);

  dataNotes$ = new Subject<any>();

  constructor(
    public modalRef: MdbModalRef<ImportEntriesComponent>,
    private modalServ: MdbModalService,
    private statuServ: StatusService
  ) {}

  ngOnInit(): void {
    this.excelFile$.subscribe((excelFile: XLSX.WorkBook) => {
      const wsname: string = excelFile.SheetNames[0];
      const ws: XLSX.WorkSheet = excelFile.Sheets[wsname];

      this.excelFileInfo$.next({
        sheets: excelFile.Sheets,
      });

      this.convertedData$.next(this.convertData(XLSX.utils.sheet_to_json(ws)));
    });

    this.convertedData$.subscribe((data: any[]) => {
      let infos: any[] = [];
      let warnings: any[] = [];
      let dangers: any[] = [];

      // infos.push(`The file contains ${data.length} potential entries.`);

      this.dataNotes$.next({ infos, warnings, dangers });
    });
  }

  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      this.excelFile$.next(wb);
    };
  }

  convertData(data: any[]) {
    let convertedData: any[] = [];
    data.forEach((entry) => {
      let convertedEntry = {
        facilityName: entry['Facility'],
        entryDate: serialDateToJSDate(
          entry['Date of Assessment (dd/ mm/ yyyy)']
        ),
        uniqueARTNumber: entry['UAN '],
        ARTStartDate: serialDateToJSDate(
          entry['Date of Assessment (dd/ mm/ yyyy)']
        ),
        age: entry['Current Age'],
        regimen: entry['Regimen'],
        regimenStartTransDate: serialDateToJSDate(
          entry['Regimen Start / Transition Date (dd/ mm/ yyyy)']
        ),
        pmtct: entry['PMTCT (Y/N)'].toLowerCase(),
        pmtctEnrollStartDate: serialDateToJSDate(
          entry['PMTCT Start (Enrollment) date (dd/ mm/ yyyy)']
        ),

        hvl: entry['HVL (Y/N)'].toLowerCase(),
        eac3Completed: entry['EAC-3 Completed (Y/N)'],
        eac3CompletionDate: serialDateToJSDate(
          entry['EAC-3 Completion date (dd/ mm/ yyyy)']
        ),
        cvh: [
          {
            lastClinicVisitDate: serialDateToJSDate(
              entry['Last Clinic Visit date (dd/ mm/ yyyy)']
            ),
            nextAppointmentDate: serialDateToJSDate(
              entry['Next appointment date (dd/ mm/ yyyy)']
            ),
            clinicVisitComment: entry['Comments '],
          },
        ],
        vlh: [
          {
            value: entry['Most current VL Result'],
            dateSampleCollected: serialDateToJSDate(
              entry['Most Current VL date (dd/ mm/ yyyy)']
            ),
          },
          {
            value: entry['2nd (Last) VL Value'],
            dateSampleCollected: serialDateToJSDate(
              entry['2nd (Last) VL date (dd/ mm/ yyyy)']
            ),
          },
          {
            value: entry['3rd (Last) VL Results'],
            dateSampleCollected: serialDateToJSDate(
              entry['3rd (Last) VL date (dd/ mm/ yyyy)']
            ),
          },
        ],
      };

      let eligibility = this.statuServ.getEligibilityStatus(convertedEntry);
      let iit = this.statuServ.getIITStatus(
        serialDateToJSDate(entry['Next appointment date (dd/ mm/ yyyy)'])
      );
      convertedData.push({ ...convertedEntry, eligibility, iit });
    });

    return convertedData;
  }

  previewEntries() {
    this.modalServ.open(ImportEntriesPreviewComponent, {
      data: { data: this.convertedData$.getValue() },
      modalClass: 'modal-dialog-centered modal-xl ',
    });
  }
}

function serialDateToJSDate(excelSerialDate: number | null): Date | null {
  return excelSerialDate ? new Date(Date.UTC(0, 0, excelSerialDate - 1)) : null;
}
