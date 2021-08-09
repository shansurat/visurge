import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject } from 'rxjs';
import { fields } from 'src/app/constants/entry-fields';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';

@Component({
  selector: 'app-export-entries-preview',
  templateUrl: './export-entries-preview.component.html',
  styleUrls: ['./export-entries-preview.component.scss'],
})
export class ExportEntriesPreviewComponent implements OnInit {
  data!: BehaviorSubject<any[]>;
  headers!: any[];

  fields = fields;
  getRegimenByCode = getRegimenByCode;

  constructor(public modalRef: MdbModalRef<ExportEntriesPreviewComponent>) {}

  ngOnInit(): void {
    console.log({ headers: this.headers });
  }
}
