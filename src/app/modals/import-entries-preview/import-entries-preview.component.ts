import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject } from 'rxjs';
import { scrollConfig } from 'src/app/constants/scrollConfig';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-import-entries-preview',
  templateUrl: './import-entries-preview.component.html',
  styleUrls: ['./import-entries-preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImportEntriesPreviewComponent implements OnInit {
  data!: BehaviorSubject<any[]>;
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
    'Next VL Date',
    'Eligibility Status',
    'IIT Status',
  ];

  scrollConfig = scrollConfig;

  constructor(
    public modalRef: MdbModalRef<ImportEntriesPreviewComponent>,
    public facilitiesServ: FacilitiesService
  ) {}
  public getRegimenByCode = getRegimenByCode;

  ngOnInit(): void {}
}
