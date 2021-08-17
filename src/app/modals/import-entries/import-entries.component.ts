import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { execFile } from 'child_process';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserEntry } from 'src/app/interfaces/user-entry';
import { FacilitiesService } from 'src/app/services/facilities.service';
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

  importLoadingInfo:
    | {
        imported: number;
        total: number;
      }
    | undefined = undefined;

  constructor(
    public modalRef: MdbModalRef<ImportEntriesComponent>,
    private modalServ: MdbModalService,
    private statuServ: StatusService,
    private facilitiesServ: FacilitiesService,
    private afs: AngularFirestore
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

      infos.push(`The file contains ${data.length} potential entries.`);

      // let _facDoesNotExist = 0;

      // for (let entry of data) {
      //   const fac = await this.facilitiesServ
      //     .getFacilityById(entry.facility)
      //     .toPromise();
      //   console.log({ fac });
      //   if (!fac) _facDoesNotExist++;
      // }

      // console.log({ _facDoesNotExist });

      // if (_facDoesNotExist)
      //   dangers.push(
      //     `There are ${_facDoesNotExist} facility with code that does not exist.`
      //   );

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
        facility: entry['Facility'],
        entryDate: serialDateToJSDate(
          entry['Date of Assessment (dd/ mm/ yyyy)']
        ),
        uniqueARTNumber: entry['UAN '],
        ARTStartDate: serialDateToJSDate(
          entry['Date of Assessment (dd/ mm/ yyyy)']
        ),
        sex: entry['Sex'] == undefined ? null : entry['Sex'],
        phoneNumber:
          entry['Phone Number'] == undefined ? null : entry['Phone Number'],
        age: {
          age: parseInt(entry['Current Age']),
          unit: 'year',
        },
        regimen: entry['Regimen'],
        regimenStartTransDate: serialDateToJSDate(
          entry['Regimen Start / Transition Date (dd/ mm/ yyyy)']
        ),
        pmtct: entry['PMTCT (Y/N)'].toLowerCase(),
        pmtctEnrollStartDate: serialDateToJSDate(
          entry['PMTCT Start (Enrollment) date (dd/ mm/ yyyy)']
        ),

        hvl: entry['HVL (Y/N)'].toLowerCase(),
        eac3Completed:
          entry['EAC-3 Completed (Y/N)'] == 'NA'
            ? null
            : entry['EAC-3 Completed (Y/N)'].toLowerCase(),
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
            clinicVisitComment:
              entry['Comments '] == undefined ? null : entry['Comments '],
          },
        ],
        vlh: [
          {
            value:
              entry['Most current VL Result'] == undefined
                ? entry['Most current VL Result']
                : null,
            dateSampleCollected: serialDateToJSDate(
              entry['Most Current VL date (dd/ mm/ yyyy)']
            ),
          },
        ],
      };

      if (
        serialDateToJSDate(entry['2nd (Last) VL date (dd/ mm/ yyyy)']) !=
        undefined
      ) {
        convertedEntry.vlh.push({
          value:
            entry['2nd (Last) VL Value'] == undefined
              ? null
              : entry['2nd (Last) VL Value'],
          dateSampleCollected: serialDateToJSDate(
            entry['2nd (Last) VL date (dd/ mm/ yyyy)']
          ),
        });
      }

      if (
        serialDateToJSDate(entry['3rd (Last) VL date (dd/ mm/ yyyy)']) !=
        undefined
      ) {
        convertedEntry.vlh.push({
          value:
            entry['3rd (Last) VL Results'] == undefined
              ? null
              : entry['3rd (Last) VL Results'],
          dateSampleCollected: serialDateToJSDate(
            entry['3rd (Last) VL date (dd/ mm/ yyyy)']
          ),
        });
      }

      const nextViralLoadSampleCollectionDate =
        this.statuServ.getNextVLDate(convertedEntry);
      const eligibility = this.statuServ.getEligibilityStatusByNextVLDate(
        nextViralLoadSampleCollectionDate as Date,
        convertedEntry.hvl == 'yes',
        convertedEntry.eac3Completed == 'yes',
        convertedEntry.vlh
      );
      const iit = this.statuServ.getIITStatus(
        serialDateToJSDate(entry['Next appointment date (dd/ mm/ yyyy)'])
      );
      convertedData.push({
        ...convertedEntry,
        nextViralLoadSampleCollectionDate,
        eligibility,
        iit,
      });
    });

    return convertedData;
  }

  previewEntries() {
    this.modalServ.open(ImportEntriesPreviewComponent, {
      data: { data: this.convertedData$ },
      modalClass:
        'modal-dialog-scrollable modal-dialog-centered modal-xl modal-container',
    });
  }

  importEntries() {
    this.convertedData$.subscribe((entries) => {
      this.importEntries$(entries);
    });
  }

  async importEntries$(entries: any[]) {
    let i = 1;
    const l = entries.length;
    for (let entry of entries) {
      let id = this.afs.collection('entries').doc().ref.id;
      let entryRef = this.afs.collection('entries').doc(id);
      await entryRef.set({ ...entry, id }, { merge: true });
      this.importLoadingInfo = {
        imported: i,
        total: l,
      };
      i++;
    }

    this.modalRef.close();
  }
}

function serialDateToJSDate(excelSerialDate: number | null): Date | null {
  return excelSerialDate ? new Date(Date.UTC(0, 0, excelSerialDate - 1)) : null;
}

function UANToId(UAN: string) {
  return UAN.replace(/\//g, '').toUpperCase();
}
