import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';

@Component({
  selector: 'app-import-entries-preview',
  templateUrl: './import-entries-preview.component.html',
  styleUrls: ['./import-entries-preview.component.scss'],
})
export class ImportEntriesPreviewComponent implements OnInit {
  data!: any[];
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
    'Viral Load Eligibility Status',
    'IIT Status',
  ];

  constructor(public modalRef: MdbModalRef<ImportEntriesPreviewComponent>) {}
  public getRegimenByCode = getRegimenByCode;

  ngOnInit(): void {}
}
